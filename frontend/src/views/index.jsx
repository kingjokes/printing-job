import { Box } from "@mui/material";
import { Outlet, } from "react-router-dom";

export default function Index() {


    return (
        <Box sx={{
            backgroundColor: '#FFF0E3',
            minHeight: '100vh'
        }}>
            <Outlet />


        </Box>
    );
}