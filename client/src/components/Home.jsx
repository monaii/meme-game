import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Button, Row, Col } from 'react-bootstrap';

const Home = () => {
    return (
        <Container className="d-flex align-items-center justify-content-center vh-100">
            <Row className="text-center">
                <Col>
                    <h1 className="mb-4">Welcome to the Meme Game</h1>
                    <Link to="/login">
                        <Button variant="primary" size="lg" className="me-3">Login</Button>
                    </Link>
                    <Link to="/game">
                        <Button variant="secondary" size="lg">Play as Guest</Button>
                    </Link>
                </Col>
            </Row>
        </Container>
    );
};

export default Home;
