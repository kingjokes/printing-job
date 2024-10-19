import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { PrintJobService } from "./print-job.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { QuoteRequestDto } from "./dto/quote-request.dto";
import { PaymentRequestDto } from "./dto/payment-request.dto";
import { diskStorage } from "multer";
import { existsSync, mkdirSync } from "fs";
import { extname } from "path";
import { CreatePriceDto } from "./dto/create-price.dto";

@Controller("print-job")
export class PrintJobController {
  constructor(private readonly printJobService: PrintJobService) {}

  @Post("upload-file")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        // Specify where to save the file
        destination: (req: any, file: any, cb: any) => {
          const uploadPath = "./uploads/";
          // Create folder if doesn't exist
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath), { recursive: true };
          }
          cb(null, uploadPath);
        },

        // Specify the file name
        filename: (req, file, cb) => {
          cb(null, Date.now() + extname(file.originalname));
        },
      }),
      fileFilter: (req: any, file: any, cb: any) => {
        if (
          extname(file.originalname) === ".pdf" ||
          extname(file.originalname) === ".docx"
        ) {
          // Allow storage of file
          cb(null, true);
        } else {
          // Reject file
          cb(
            new HttpException(
              `Unsupported file type ${extname(file.originalname)}, only .wav is allowed`,
              HttpStatus.BAD_REQUEST
            ),
            false
          );
        }
      },
    })
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      return await this.printJobService.processFile(file);
    } catch (e) {
      throw e;
    }
  }

  @Post("print-quote")
  async getQuote(@Body() quoteData: QuoteRequestDto) {
    try {
      return await this.printJobService.calculateQuote(quoteData);
    } catch (e) {
      throw e;
    }
  }

  @Post("payment")
  async processPayment(@Body() paymentData: PaymentRequestDto) {
    try {
      return await this.printJobService.processPayment(paymentData);
    } catch (e) {
      throw e;
    }
  }

  @Post("pricing")
  async updatePricing(@Body() body: CreatePriceDto) {
    try {
      return await this.printJobService.updatePrice(body);
    } catch (e) {
      throw e;
    }
  }

  @Get("pricing")
  async fetchPricing() {
    try {
      return await this.printJobService.fetchPricing();
    } catch (e) {
      throw e;
    }
  }

  @Get("jobs")
  async fetchJobs() {
    try {
      return await this.printJobService.fetchJobs();
    } catch (e) {
      throw e;
    }
  }
}
