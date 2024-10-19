import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Box, TextField } from "@mui/material";
import formatAmount from "../utils/formatAmount";
import ToastMessage from "../utils/toastMessage";
import { useCallback, useState } from "react";
import { submitPayment } from "../services/user-service";
import { LoadingButton } from "@mui/lab";

export default function ConfirmPayment({ dialog, setDialog, setFile, quote, breakdown }) {

    const [email, setEmail] = useState('')

    const [loading, setLoading] = useState(false)

    const handlePayment = useCallback(async (e) => {
        e.preventDefault()
        if (!email) return ToastMessage('error', "kindly enter your email to proceed")
        setLoading(true)
        await submitPayment({ email, id: breakdown?.id, quotedPrice: quote.totalCost })
            .then(response => response.data)
            .then(response => {
                setLoading(false)
                ToastMessage(response.status ? 'success' : 'error', response.message)
                if (response.status) {
                    setFile("")
                    setDialog(false)

                }
            }).catch(() => setLoading(false))

    }, [email, setDialog, setFile, breakdown, quote])

    return (

        <Dialog maxWidth={'xs'} fullWidth open={dialog} >
            <DialogTitle className="w3-border-bottom">

                <h5>  Payment Confirmation</h5>


            </DialogTitle>
            <DialogContent sx={{ px: 2, pt: 2, pb: 4 }}>
                <br />
                <Box sx={{ textAlign: 'center' }}>
                    <h6 style={{ fontWeight: '500' }}>Printing Quote</h6>


                    <p style={{ fontSize: 14, lineHeight: 1.8 }}> <span>This printing of document would be:</span>
                        <br />
                        <b style={{ fontSize: 12 }}>Total Pages: {formatAmount(breakdown?.totalPages || 0)}</b>
                        <br />
                        <b>Total Cost: {formatAmount(quote?.totalCost || 0)} Naira</b>

                    </p>
                    <br />


                    <form onSubmit={handlePayment}>
                        <TextField
                            id="email"
                            label="Email"
                            value={email}
                            type="email"
                            fullWidth
                            size="small"
                            onChange={({ target: { value } }) => setEmail(value)}

                        />
                        <br />
                        <br />
                        <LoadingButton loading={loading}
                            type="submit"
                            color="primary"
                            disableElevation
                            sx={{ textTransform: 'none', height: 45 }}
                            variant="contained"
                            fullWidth
                        >
                            Pay Now
                        </LoadingButton>

                    </form>
                </Box>
            </DialogContent>

        </Dialog>
    )
}