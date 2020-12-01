import React, {useState, useEffect} from 'react';
import { Button, Modal } from 'react-bootstrap';

function ModalWindow(props) {
  console.log("Show is now " + props.show);
  const [show, setShow] = useState(props.show);

  useEffect(() => {
    setShow(props.show);
  }, [show])

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  console.log(show)
  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Launch demo modal
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalWindow;


