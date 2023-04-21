import { Alert, AlertTitle } from "@mui/material"


export const Popup = (props) => {
    const details = {
        "title": (props.severity === "success" )? "Success" : "Error",
        "message": props.messages
    }

    return (
        <Alert severity={props.severity} onClose={props.onClose} variant="filled">
            <AlertTitle>{details.title}</AlertTitle>
            {props.message}
        </Alert>
    )
}