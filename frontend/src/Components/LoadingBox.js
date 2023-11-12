import Spinner from "react-bootstrap/Spinner";
export default function LoadingBox() {
  return (
    <Spinner animation="border" roles="status">
      <span className="visually-hidden">Laoding...</span>
    </Spinner>
  );
}
