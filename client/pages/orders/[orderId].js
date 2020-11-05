import Router from "next/router";
import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/use-request";

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeleft] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push("/orders"),
  });
  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeleft(Math.round(msLeft / 1000));
    };
    findTimeLeft(); //without waiting for first 1sec
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId); //Clean up function
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  return (
    <div>
      <h1>
        Time left to pay {Math.round(timeLeft / 60)} : {timeLeft % 60}
      </h1>
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51Hjp2VBAybixDbcfM46dqlmCEnpQo2om4UkVUOoXp3zZaZIhAPegNSY2nPP8srG0H38tGzLxuMLXbl02C7TxFIQT00ky1jsrcd"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
    </div>
  );
};
OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  console.log(orderId);
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
