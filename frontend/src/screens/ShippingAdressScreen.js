import { Helmet } from "react-helmet-async";
import Form from "react-bootstrap/Form";
import { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import { Store } from "../Store";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "../Components/CheckoutSteps";
export default function ShippingAdressScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;
  const navigate = useNavigate();
  const [fullname, setFullName] = useState(shippingAddress.fullname || "");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalcode, setPostalcode] = useState(
    shippingAddress.postalcode || ""
  );
  const [country, setCountry] = useState(shippingAddress.country || "");
  useEffect(() => {
    if (!userInfo) {
      navigate("/signin?redirect=/shipping");
    }
  }, [navigate, userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: {
        fullname,
        address,
        city,
        postalcode,
        country,
      },
    });

    localStorage.setItem(
      "shippingAddress",
      JSON.stringify({ fullname, address, city, postalcode, country })
    );
    navigate("/payment");
  };
  return (
    <div>
      <Helmet>Shipping Address</Helmet>

      <CheckoutSteps step1 step2></CheckoutSteps>
      <h1 className="my-3">Shipping Address</h1>

      <div>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="fullName"></Form.Group>
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            className="input-style"
            value={fullname}
            onChange={(e) => {
              setFullName(e.target.value);
            }}
            required
          ></Form.Control>
          <Form.Group className="mb-3" controlId="address"></Form.Group>
          <Form.Label>Address</Form.Label>
          <Form.Control
            className="input-style"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
            }}
            required
          ></Form.Control>
          <Form.Group className="mb-3" controlId="city"></Form.Group>
          <Form.Label>City</Form.Label>
          <Form.Control
            className="input-style"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
            }}
            required
          ></Form.Control>
          <Form.Group className="mb-3" controlId="postalcode"></Form.Group>
          <Form.Label>PostalCode</Form.Label>
          <Form.Control
            className="input-style"
            value={postalcode}
            onChange={(e) => {
              setPostalcode(e.target.value);
            }}
            required
          ></Form.Control>
          <Form.Group className="mb-3" controlId="country"></Form.Group>
          <Form.Label>Country</Form.Label>
          <Form.Control
            className="input-style"
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
            }}
            required
          ></Form.Control>
          <div className="mt-3">
            <Button className="btn btn-primary my-custom-button" type="submit">
              Continue
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
