import React from "react";

/**
 * This function returns a component containing buttons to switch from one page to another
 * @param {function} function to set state of the pageNumber variable 
 * @returns {JSX component}
 */
function PaginationButtons({ handlePageNumberChange }) {
    const styles = {
        'marginTop': '10px',
        'left': '50%',
        'transform': 'translate(-50%, 0)',
        'marginBottom': '50px'
    };

    const styles2 = {
        'color': 'white',
        'borderColor': 'white'
    };

    // wrapper for setState of page number
    function wrapSetPageNumber(pageNumber) {
        handlePageNumberChange(pageNumber);
    }

    // wrapper for decrement page number by 1
    function wrapChangePgNumDec() {
        handlePageNumberChange(prev => {
            return prev === 0 ? prev : prev - 1;
        });
    }

    // wrapper for page number increment
    function wrapChangePgNumInc() {
        handlePageNumberChange(prev => {
            return prev === 3 ? prev : prev + 1;
        });
    }

    return (
        <div className="btn-group mt-10" style={styles}>
            <button type="button" className="btn btn-outline-secondary" onClick={wrapChangePgNumDec} style={styles2}>{'<<'}</button>
            <button type="button" className="btn btn-outline-secondary" onClick={() => wrapSetPageNumber(0)} style={styles2}>1</button>
            <button type="button" className="btn btn-outline-secondary" onClick={() => wrapSetPageNumber(1)} style={styles2}>2</button>
            <button type="button" className="btn btn-outline-secondary" onClick={() => wrapSetPageNumber(2)} style={styles2}>3</button>
            <button type="button" className="btn btn-outline-secondary" onClick={() => wrapSetPageNumber(3)} style={styles2}>4</button>
            <button type="button" className="btn btn-outline-secondary" onClick={wrapChangePgNumInc} style={styles2}>{'>>'}</button>
        </div>
    );
}

export default PaginationButtons;