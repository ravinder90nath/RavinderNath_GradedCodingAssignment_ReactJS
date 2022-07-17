import { useEffect, useState } from "react";
import { Alert, Col, Container, Modal, Row } from "react-bootstrap";
import IMovie from "../../models/IMovie";
import { LoadingStatus } from "../../models/types";
import LoadingIndicator from "../common/LoadingIndicator";
import { getMovieDetailsByID, getMovieDetailsByTitleAndYear } from "../../services/Movie";
import { Link, useLocation, useParams } from "react-router-dom";

type Props = {

};
const MovieDetails = ( props : Props ) => {
    const [ status, setStatus] = useState<LoadingStatus>( 'LOADING' );
    const [ movie, setMovie] = useState<IMovie | null>( null );
    const [ error, setError] = useState<Error | null>( null );

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const param = useParams();
    const info : any = useLocation().state;

    useEffect( 
        () => {
        const fetchMovie = async () => {
            
            try {

                if (info.data.id) {
                    const data = await getMovieDetailsByID(info.data.currentTab, info.data.id);
                    setMovie(data);
                } else {
                    const data = await getMovieDetailsByTitleAndYear(info.data.currentTab, param.title as string, info.data.releasedYear); 
                    setMovie( data[0] );
                }                
                setStatus( 'LOADED' );
            } catch (error) {
                setError( error as Error );
                setStatus( 'ERROR_LOADING');
            }
            
        };

        fetchMovie();
    }, [info.data.currentTab, info.data.id, info.data.releasedYear, param.title] );

    let el;

    switch ( status ) {
        case 'LOADING':
            el = (
                <LoadingIndicator 
                    size="large"
                    message="Please wait..." />
            );
            break;
        case 'LOADED':
            const {
                title,
                year,
                genres,
                poster,
                contentRating,
                duration,
                releaseDate,
                averageRating,
                storyline,
                actors,
                imdbRating,
            } = movie as IMovie;
            el = (
                <>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton className="custom-model-header"></Modal.Header>
                    <Modal.Body className="custom-model-body">
                        <img 
                            src={`${process.env.REACT_APP_BASE_URL}/images/${poster}`} 
                            alt="{title}" 
                            className="custom-modal-image"
                        />
                    </Modal.Body>
                </Modal>
                <div className="back-menu">
                    <Link to="/" className="back-home"> Back to Home</Link>
                </div>
                <div className="content-container">
                <Container>
                    <Row>
                        <Col xs={12} lg={3}>
                                <img 
                                    src={`${process.env.REACT_APP_BASE_URL}/images/${poster}`} 
                                    alt={title} 
                                    className="img-container"
                                    onClick={handleShow}
                                />
                        </Col>
                        <Col xs={12} lg={9}>
                            <Row>
                                <Col xs={12}>
                                    <h1><span className="movieTitle">{title}</span> <span className="movieYear">({year})</span></h1>
                                    
                                </Col>
                            </Row>
                            {
                                imdbRating && (
                                    <Row >
                                        <Col xs={3}>
                                            <span>Imdb Rating</span>
                                        </Col>
                                        <Col xs={9}>{imdbRating}/10</Col>
                                    </Row>
                                )
                            }
                            {
                                contentRating && (
                                    <Row >
                                        <Col xs={3}>
                                             <span>Content Rating</span>
                                        </Col>
                                        <Col xs={9}>{contentRating}</Col>
                                    </Row>
                                )
                            }
                            {
                                averageRating>=0 && (
                                    <Row >
                                        <Col xs={3}>
                                            <span>Average Rating</span>
                                        </Col>
                                        <Col xs={9}>{averageRating}</Col>
                                    </Row>
                                )
                            }
                            {
                                duration && (
                                    <Row >
                                        <Col xs={3}>
                                            <span>Duration</span>
                                        </Col>
                                        <Col xs={9}>{Math.floor(Number(duration.replace("PT","").replace("M",""))/60)}h {Number(duration.replace("PT","").replace("M",""))%60}m</Col>
                                    </Row>
                                )
                            }
                            {
                                genres && (
                                    <Row >
                                        <Col xs={3}>
                                            <span>Genres</span>
                                        </Col>
                                        <Col xs={9}>
                                            {
                                                genres.map(
                                                    genre => (
                                                        <span>{genre}, </span>
                                                    )
                                                )
                                            }
                                        </Col>
                                    </Row>
                                )
                            }
                            {
                                actors && (
                                    <Row >
                                        <Col xs={3}>
                                            <span>Actors</span>
                                        </Col>
                                        <Col xs={9}>
                                            {
                                            actors.map(
                                                actor => (
                                                    <span>{actor}, </span>
                                                )
                                            )
                                        }
                                        </Col>
                                    </Row>
                                )
                            }
                            {
                                releaseDate && (
                                    <Row >
                                        <Col xs={3}>
                                            <span>Release Date</span>
                                        </Col>
                                        <Col xs={9}>{releaseDate}</Col>
                                    </Row>
                                )
                            }
                            {
                                storyline && (
                                    <Row >
                                        <Col xs={3}>
                                            <span>Storyline</span>
                                        </Col>
                                        <Col xs={9}>{storyline}</Col>
                                    </Row>
                                )
                            }
                        </Col>
                    </Row>
                </Container>
                </div>
                </>
            );
            break;
        case 'ERROR_LOADING':
            el = (
                <Alert variant="danger">
                    {error?.message}
                </Alert>
            );
            break;
    }

    return el;
}

export default MovieDetails;