import { Box, Grid2, Button, TextField } from "@mui/material";
import { AddOutlined, DescriptionOutlined, FileOpenOutlined, } from '@mui/icons-material'
import { useEffect, useMemo, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { LoadingButton } from "@mui/lab";
import { updatePricing } from "../services/user-service";
import ToastMessage from "../utils/toastMessage";
import { useDispatch, useSelector } from "react-redux";
import { getJobs, getPricing } from "../store/user";
import formatAmount from "../utils/formatAmount";

export default function AdminPage() {

    const { jobs, pricing } = useSelector(state => state.user)


    const formInput = useMemo(() => [
        { title: 'B&W Cost per Page', key: 'bwPageCost', type: 'number', value: 20 },
        { title: 'Color Cost per Page', key: 'colorPageCost', type: 'number', value: 25 },
        { title: ' Cost per Pixel', key: 'pixelCost', type: 'number', value: 0.00005 },
    ], [])

    const dispatch = useDispatch()


    const [loading, setLoading] = useState(false)

    const printJobs = useMemo(() => jobs || [], [jobs])

    const formik = useFormik({
        initialValues: {
            bwPageCost: pricing?.bwPageCost || 20,
            colorPageCost: pricing?.colorPageCost || 25,
            pixelCost: pricing?.pixelCost || 0.00005,
        },
        validationSchema: yup.object({
            bwPageCost: yup.string().required("Required"),
            colorPageCost: yup
                .string()
                .required("Required"),

            pixelCost: yup
                .string()
                .required("Required")
            ,
        }),
        onSubmit: async (values) => {

            setLoading(true)

            await updatePricing(values)
                .then(response => response.data)
                .then(response => {
                    setLoading(false)

                    ToastMessage(response.status ? 'success' : 'error', response.message)

                    if (response.status) {
                        dispatch(getPricing())
                    }

                }).catch(e => setLoading(false))


        },
    });

    useEffect(() => {
        dispatch(getJobs())
        dispatch(getPricing())
    }, [])



    return (
        <Box sx={{ pt: 6 }}>

            <Grid2 container spacing={1} sx={{ px: 2, }} minHeight={'80vh'}>

                <Grid2 size={{ xs: 12, sm: 2, md: 2, lg: 2 }} />
                <Grid2 size={{ xs: 12, sm: 8, md: 8, lg: 8 }}>

                    <h2>Admin Dashboard</h2>
                    <br />

                    <h6><b>Pricing Configuration</b></h6>
                    <br />


                    <form
                        onSubmit={formik.handleSubmit}
                        autoComplete="off"
                        style={{ maxWidth: 500 }}
                    >
                        {formInput.map((item, index) => (
                            <Box key={index}>

                                <TextField
                                    label={<span style={{ color: '#45474A', fontWeight: '600' }}>{item.title}</span>}
                                    value={formik.values[item.key]}
                                    onChange={({ target: { value } }) =>
                                        formik.setFieldValue(item.key, value)
                                    }
                                    placeholder={item.placeholder}
                                    error={
                                        formik.touched[item.key] && Boolean(formik.errors[item.key])
                                    }
                                    helperText={formik.touched[item.key] && formik.errors[item.key]}
                                    margin="normal"
                                    id={item.key}
                                    type={item.type}
                                    name={item.key}
                                    sx={{ mb: 2, mt: 0.3 }}
                                    variant="outlined"
                                    fullWidth
                                ></TextField>

                            </Box>
                        ))}

                        <br />


                        <LoadingButton
                            variant="contained"
                            type="submit"
                            disableElevation
                            loading={loading}
                            fullWidth
                            sx={{
                                backgroundColor: "primary",

                                textTransform: "capitalize",
                                fontWeight: "600",
                                color: "white",
                                height: 50,
                                borderRadius: 1


                            }}
                        >
                            Change Price
                        </LoadingButton>
                    </form>

                    <br />

                    <br />

                    <h6><b>Print Jobs</b></h6>
                    <table className="w3-table-all">
                        <thead>
                            <tr>
                                <th>Job ID</th>
                                <th>File Uploaded</th>
                                <th>Total Pages</th>
                                <th>B&W Pages</th>
                                <th>Color Pages</th>
                                <th>Total Pixels</th>
                                <th>Amount Paid</th>
                            </tr>
                        </thead>
                        <tbody>
                            {printJobs.map((job, index) => (
                                <tr key={index}>
                                    <td>{job.id}</td>
                                    <td><a href={job.fileName} target="_blank" style={{ color: 'blue' }}>{job.fileName}</a></td>
                                    <td>{formatAmount(job.totalPages)}</td>
                                    <td>{formatAmount(job.bwPages)}</td>
                                    <td>{formatAmount(job.colorPages)}</td>
                                    <td>{formatAmount(job.totalPixels)}</td>
                                    <td><b>NGN {formatAmount(job.quotedPrice)}</b></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </Grid2>

            </Grid2>

        </Box>
    )
}