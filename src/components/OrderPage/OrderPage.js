import React, {useEffect, useState, Redirect} from "react";
import PropTypes from "prop-types";

import {makeStyles} from "@material-ui/core/styles";

import {firestore} from "../../firebase";
import {useHistory, useParams} from "react-router-dom";
import EmptyState from "../EmptyState";
import {ReactComponent as NoDataIllustration} from "../../illustrations/no-data.svg";
import {ReactComponent as ErrorIllustration} from "../../illustrations/error.svg";
import {Box, Fab, Button, Grid, Divider, Card} from "@material-ui/core";
import Loader from "../Loader";
import OrderView from "../OrderView";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Typography from "@material-ui/core/Typography";
import {ArrowBackIos as BackIcon, Refresh as RefreshIcon} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
    root: {
        margin: "0 auto",
        marginTop: theme.spacing(8),
    },
    header: {
        height: theme.spacing(8),
        padding: "15px",

        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    link: {
        color: 'white',
    },
    button: {
        paddingBottom: 10,
    },
}));

function OrderPage(props) {
    // Styling
    const classes = useStyles();

    const history = useHistory();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [order, setOrder] = useState(null)

    // Custom Properties
    const {user, userData, theme} = props;
    const {orderId} = useParams();

    // Custom Functions
    const {openSnackbar} = props;

    useEffect(() => {
        const unsubscribe = firestore
            .collection("orders")
            .doc(orderId)
            .onSnapshot(
                (snapshot) => {
                    const data = snapshot.data();

                    if (!snapshot.exists || !data) {
                        return;
                    }

                    setOrder(data);
                    setLoading(false);
                },
                (error) => {
                    setLoading(false);
                    setError(error);
                }
            );
        return () => unsubscribe()
    }, []);

    if (error) {
        return (
            <EmptyState
                image={<ErrorIllustration/>}
                title="Не удалось получить пользователя."
                description="Что-то пошло не так при попытке получить пользователя."
                button={
                    <Fab
                        variant="extended"
                        color="primary"
                        onClick={() => window.location.reload()}
                    >
                        <Box clone mr={1}>
                            <RefreshIcon/>
                        </Box>
                        Повторить
                    </Fab>
                }
            />
        );
    }

    if (loading) {
        return <Loader/>;
    }

    if (order) {
        return (
            <Grid item xs={12} sm={12} md={10} lg={8} className={classes.root}>
                <Card>
                    <Box className={classes.header}>
                        <Button
                            startIcon={<BackIcon/>}
                            onClick={() => history.goBack()}
                        >
                            Назад
                        </Button>

                        <Typography color="initial" variant="h6" component="p" align="center">
                            {(order.name) ? (order.name) : ("информация отсутствует (")}
                        </Typography>

                        <IconButton>
                            <MoreVertIcon/>
                        </IconButton>
                    </Box>
                    <Divider light/>

                    <OrderView order={order}/>
                </Card>
            </Grid>
        );
    }

    return (
        <EmptyState
            image={<NoDataIllustration/>}
            title="No orders"
            description="Сорян, братан, но заказов пока нет("
        />
    );


}

OrderPage.propTypes = {
    // Custom Properties
    theme: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    userData: PropTypes.object,

    // Custom Functions
    openSnackbar: PropTypes.func.isRequired,
};

export default OrderPage;
