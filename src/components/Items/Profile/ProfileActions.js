import React from "react";
// @material-ui/core components
import {makeStyles} from "@material-ui/core/styles";
import classNames from "classnames";
import Button from "@material-ui/core/Button";
import {useHistory} from "react-router-dom";
import channels from "../../../services/channels";
import authentication from "../../../services/authentication";

const useStyles = makeStyles({
    main: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },

    btn: {
        width: "100%",
    },
});


export default function ProfileActions(props) {
    const classes = useStyles();
    const {setLoading, openSnackbar, profile, userData} = props;
    const history = useHistory();

    const goToChannel = (id) => {
        history.push(`/dialog/${id}`);
    };

    const handleChannel = () => {
        setLoading(true);
        channels
            .addChannelProfile(profile, userData)
            .then((id) => {
                goToChannel(id);
            })
            .catch((reason) => {
                const code = reason.code;
                const message = reason.message;

                switch (code) {
                    default:
                        openSnackbar(message);
                        return;
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const handleRespondBtn = () => {
        authentication
            .addMemberToResponses(profile.id)
            .then(() => {
                handleChannel();
            })
            .catch((reason) => {
                const code = reason.code;
                const message = reason.message;

                switch (code) {
                    default:
                        openSnackbar(message);
                        return;
                }
            })

    }

    return (
        <div className={classNames(classes.main)}>
            <Button color="primary" variant="contained" className={classNames(classes.btn)}
                    onClick={handleRespondBtn}>
                {profile.disabled ? "Перейти к обсуждению" : "Оставить заявку"}
            </Button>
        </div>
    );
}

