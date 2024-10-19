import { Injectable } from "@nestjs/common";
import { promises as fs } from "fs";
import * as pdf from "pdf-parse";
import * as mammoth from "mammoth";
import * as sharp from "sharp";
import * as ColorThief from "colorthief";
import { QuoteRequestDto } from "./dto/quote-request.dto";
import { PaymentRequestDto } from "./dto/payment-request.dto";
import { PrismaService } from "src/prisma.service";
import { CreatePriceDto } from "./dto/create-price.dto";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";

interface PageInfo {
  isColored: boolean;
  images: ImageInfo[];
}

interface ImageInfo {
  width: number;
  height: number;
  pixelCount: number;
  isColored: boolean;
}

@Injectable()
export class PrintJobService {
  constructor(
    private readonly prismaService: PrismaService,
    private cloudinary: CloudinaryService
  ) {}

  //process uploaded file and generate pages contents
  async processFile(file: Express.Multer.File) {
    let pageInfos: PageInfo[] = [];

    if (file.mimetype === "application/pdf") {
      pageInfos = await this.processPdf(file.path);
    } else if (
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      pageInfos = await this.processDocx(file.path);
    }

    //calculate file contentts
    const totalPages = pageInfos.length;
    const colorPages = pageInfos.filter((page) => page.isColored).length;
    const bwPages = totalPages - colorPages;
    const totalImages = pageInfos.reduce(
      (sum, page) => sum + page.images.length,
      0
    );
    const totalPixels = pageInfos.reduce(
      (sum, page) =>
        sum + page.images.reduce((pageSum, img) => pageSum + img.pixelCount, 0),
      0
    );

    //save generated details into db
    const query = await this.prismaService.printJob.create({
      data: {
        fileName: `${process.env.APP_URL}${file.path}`,
        fileType: file.mimetype,
        totalPages,
        bwPages,
        colorPages,
        totalImages,
        totalPixels,
      },
    });
    return {
      totalPages,
      colorPages,
      bwPages,
      totalImages,
      totalPixels,
      id: query.id,
    };
  }

  //handle pdf file contents, returns array of images and is colored property of the pdf file
  private async processPdf(filePath: string): Promise<PageInfo[]> {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);
    const pageInfos: PageInfo[] = [];

    for (let i = 1; i <= data.numpages; i++) {
      const pageData = await pdf(dataBuffer, { pageNumber: i });

      const isColored = await this.isPageColored(pageData.text);
      const images = await this.extractImagesFromPdf(filePath, i);
      pageInfos.push({ isColored, images });
    }

    return pageInfos;
  }

  //handles document file tupes and return images and colored properties
  private async processDocx(filePath: string): Promise<PageInfo[]> {
    const { value: content } = await mammoth.convertToHtml({ path: filePath });
    const pageInfos: PageInfo[] = [];

    // Simplified page detection (assuming each <p> tag is a new page)
    const pages = content.split("<p>");

    for (const page of pages) {
      const isColored = await this.isPageColored(page);
      const images = await this.extractImagesFromHtml(page);
      pageInfos.push({ isColored, images });
    }

    return pageInfos;
  }

  //a method to check if a page contains these type of color formatting
  private async isPageColored(content: string): Promise<boolean> {
    const colorKeywords = ["color", "rgb", "rgba", "#"];
    return colorKeywords.some((keyword) =>
      content.toLowerCase().includes(keyword)
    );
  }

  //mockup extract images from document
  private async extractImagesFromPdf(
    filePath: string,
    pageNumber: number
  ): Promise<ImageInfo[]> {
    return [
      {
        width: 300,
        height: 200,
        pixelCount: 60000,
        isColored: true,
      },
    ];
  }

  //function extracts images from pdf
  //method still under implementation
  private async ExtractImagesFromPDF(
    pdfPath: string,
    count: number
    // pageData: any,
  ) {
    const dataBuffer = await fs.readFile(pdfPath);
    const data = await pdf(dataBuffer);

    const images = [];
    for (let i = 0; i < data.numpages; i++) {
      const page = await pdf(dataBuffer, {
        max: 1,
        pagerender: this.renderPage,
      });
      console.log(page);
      images.push(...page.images);
    }

    const imageDetails = await Promise.all(images.map(this.analyzeImage));
    return imageDetails;
  }

  async analyzeImage(imageBuffer: any) {
    const image = sharp(imageBuffer);
    const metadata = await image.metadata();
    const stats = await image.stats();

    const isColored = stats.channels.some(
      (channel) =>
        channel.min !== channel.max ||
        (channel.min !== 0 && channel.min !== 255)
    );

    return {
      width: metadata.width,
      height: metadata.height,
      pixelCount: metadata.width * metadata.height,
      isColored: isColored,
    };
  }

  //extract images from html content generated from document file types
  private async extractImagesFromHtml(html: string): Promise<ImageInfo[]> {
    const imageRegex = /<img[^>]+src="([^">]+)"/g;
    const images: ImageInfo[] = [];
    let match;

    while ((match = imageRegex.exec(html)) !== null) {
      const imgSrc = match[1];

      // a mock up image details
      images.push({
        width: 300,
        height: 200,
        pixelCount: 60000,
        isColored: true,
      });
    }

    return images;
  }

  //pdf image rendering option
  async renderPage(pageData: any) {
    const renderOptions = {
      normalizeWhitespace: false,
      disableCombineTextItems: false,
    };
    return pageData.getTextContent(renderOptions);
  }

  //calculate the quote for a printing job
  async calculateQuote(quoteData: QuoteRequestDto) {
    const pricing = await this.prismaService.pricing.findFirst({});

    const { bwPages, colorPages, totalPixels } = quoteData;
    const bwCost = bwPages * (pricing.bwPageCost || 20); // Assuming 20 Naira per B&W page
    const colorCost = colorPages * (pricing.colorPageCost || 25); // Assuming 25 Naira per color page
    const pixelCost = totalPixels * (pricing.pixelCost || 0.00005); // Assuming 0.00005 Naira per pixel

    const totalCost = bwCost + colorCost + pixelCost;

    const query = await this.prismaService.printJob.update({
      where: {
        id: quoteData.id,
      },
      data: {
        quotedPrice: totalCost,
      },
    });

    return {
      totalCost,
      breakdown: { bwCost, colorCost, pixelCost },
      id: query.id,
    };
  }

  //process a mockup payment for users
  async processPayment(paymentData: PaymentRequestDto) {
    // Mock payment processing
    const paymentSuccessful = Math.random() < 0.9; // 90% success rate for demonstration

    const query = await this.prismaService.printJob.update({
      data: {
        status: paymentSuccessful ? "success" : "failed",
        customerEmail: paymentData.email,
      },
      where: {
        id: paymentData.id,
      },
    });

    if (query) {
      if (paymentSuccessful) {
        this.sendConfirmationEmail(paymentData.email);
        return { status: true, message: "Payment processed successfully" };
      } else {
        return { status: false, message: "Payment processing failed" };
      }
    }

    return { status: false, message: "error processing payment" };
  }

  //mockup payment confirmation
  private sendConfirmationEmail(email: string) {
    // Mock email sending
    console.log(`Confirmation email sent to ${email}`);
  }

  //update printing price
  async updatePrice(data: CreatePriceDto) {
    const checker = await this.prismaService.pricing.findFirst({});

    const query = checker
      ? await this.prismaService.pricing.update({
          where: {
            id: checker.id,
          },
          data: {
            ...data,
          },
        })
      : await this.prismaService.pricing.create({
          data,
        });

    return query
      ? { status: true, message: "Prices updated successfully" }
      : { status: false, message: "unable to update price" };
  }

  //fetch printing price
  async fetchPricing() {
    const query = await this.prismaService.pricing.findFirst({});

    return {
      status: true,
      message: "pricing fetched",
      details: {
        bwPageCost: query?.bwPageCost || 20,
        colorPageCost: query?.colorPageCost || 25,
        pixelCost: query?.pixelCost || 0.00005,
      },
    };
  }

  //fetch printing jobs from db
  async fetchJobs() {
    const query = await this.prismaService.printJob.findMany({});

    return {
      status: true,
      message: "jobs fetched",
      data: query,
    };
  }
}
