import Spinner from 'react-bootstrap/Spinner';

export const Loading = () => {
    return (
        <Spinner animation="border" variant="secondary" style={{width: '150px', height: '150px', margin: 'auto'}}>
            <span className="sr-only">Loading...</span>
        </Spinner>
    );
}