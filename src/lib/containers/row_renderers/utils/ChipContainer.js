import React from 'react'
const uuidv4 = require('uuid/v4')

const ChipContainer = ({chips}) => {
    return (
        <React.Fragment>
            {chips.map(
                el => {
                    return (<span key={uuidv4()}> {el}</span>)
                }
            )}
        </React.Fragment>
    )
}

export default ChipContainer