import React from "react";

function PaginationButtons({handlePageNumberChange}){
    const styles = {
        'marginTop': '10px',
        'left': '50%',
        'transform': 'translate(-50%, 0)'
    }

    function wrapSetPageNumber(pageNumber){
        handlePageNumberChange(pageNumber);
    }

    function wrapChangePgNumDec(){
        handlePageNumberChange(prev => {
            return prev === 0 ? prev : prev - 1;
        });
    }

    function wrapChangePgNumInc(){
        handlePageNumberChange(prev => {
            return prev === 3 ? prev : prev + 1;
        });
    }

    return (
        <div className="btn-group mt-10" style={styles}>
            <button type="button" className="btn btn-outline-secondary" onClick={wrapChangePgNumDec}>{'<<'}</button>
            <button type="button" className="btn btn-outline-secondary" onClick={()=>wrapSetPageNumber(0)}>1</button>
            <button type="button" className="btn btn-outline-secondary" onClick={()=>wrapSetPageNumber(1)}>2</button>
            <button type="button" className="btn btn-outline-secondary" onClick={()=>wrapSetPageNumber(2)}>3</button>
            <button type="button" className="btn btn-outline-secondary" onClick={()=>wrapSetPageNumber(3)}>4</button>
            <button type="button" className="btn btn-outline-secondary" onClick={wrapChangePgNumInc}>{'>>'}</button>
        </div>
    );
}

export default PaginationButtons;