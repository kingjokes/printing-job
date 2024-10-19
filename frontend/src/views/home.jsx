import { Box, Grid2, Button } from "@mui/material";
import {
  AddOutlined,
  DescriptionOutlined,
  FileOpenOutlined,
} from "@mui/icons-material";
import { useCallback, useRef, useState } from "react";
import { LoadingButton } from "@mui/lab";
import ToastMessage from "../utils/toastMessage";
import { formatSize } from "../utils/format-size";
import { printQuote, uploadFile } from "../services/user-service";
import ConfirmPayment from "./confirm-payment";

export default function Home() {
  const inputRef = useRef();
  const [file, setFile] = useState();

  const [loading, setLoading] = useState(false);

  const [dialog, setDialog] = useState(false);
  const [quote, setQuote] = useState("");
  const [breakdown, setBreakdown] = useState("");

  const handleQuote = useCallback(async (payload) => {
    await printQuote(payload)
      .then((response) => response.data)
      .then(async (response) => {
        setLoading(false);
        if (response) {
          setQuote(response);
          setDialog(true);
        }
      })
      .catch((e) => {
        setLoading(false);
      });
  }, []);

  const handleUpload = useCallback(async () => {
    if (!file) return ToastMessage("error", "Kindly upload a document or pdf");

    setLoading(true);

    await uploadFile({ file })
      .then((response) => response.data)
      .then(async (response) => {
        if (response) {
          setBreakdown(response);
          return handleQuote(response);
        }

        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  }, [file, handleQuote]);

  return (
    <Box>
      <Grid2
        container
        spacing={1}
        sx={{ px: 2 }}
        alignItems={"center"}
        minHeight={"80vh"}
      >
        <Grid2 size={{ xs: 12, sm: 3, md: 3, lg: 3 }} />
        <Grid2 size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <Box
            sx={{
              backgroundColor: "#F8F8F8",
              py: 5,
              px: 5,
            }}
          >
            <Box
              onClick={() => inputRef.current.click()}
              sx={{
                border: "2px dashed #48484833",
                borderRadius: 1,
                padding: 3,
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              <input
                type="file"
                hidden
                accept={".pdf,.docx"}
                ref={inputRef}
                onChange={({ target }) => {
                  let file = target.files[0];

                  let allowedFiles = [
                    "application/pdf",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                  ];

                  if (allowedFiles.includes(file?.type)) {
                    setFile(file);

                    return;
                  }

                  setFile("");

                  return ToastMessage(
                    "error",
                    "Only pdf and docx files are allowed"
                  );
                }}
              />

              <DescriptionOutlined sx={{ fontSize: 40, color: "#484848" }} />

              <p>
                Click to select and upload your file locally.
                <br /> <b>Only .pdf or .docx files are allowed</b>
              </p>

              {file && (
                <p style={{ fontWeight: "600", fontSize: 13 }}>
                  {file?.name} -{formatSize(file?.size || 0)}
                </p>
              )}
            </Box>
            <br />

            <div style={{ textAlign: "center" }}>
              <LoadingButton
                onClick={() => handleUpload()}
                loading={loading}
                variant="contained"
                endIcon={<AddOutlined />}
                disableElevation
                sx={{
                  textTransform: "none",
                  height: 50,
                  width: 150,
                }}
                color="primary"
              >
                Upload
              </LoadingButton>
            </div>
          </Box>
        </Grid2>
      </Grid2>

      <ConfirmPayment
        dialog={dialog}
        setDialog={setDialog}
        setFile={setFile}
        quote={quote}
        breakdown={breakdown}
      />
    </Box>
  );
}
