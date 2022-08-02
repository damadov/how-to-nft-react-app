import React from 'react';
import PropTypes from 'prop-types';

export const StakeItem = ({days, speed}) => (
 <div className="row justify-content-center">
   <form className="form-inline">
     <input
       type="text"
       className="form-control mb-2 mr-sm-2"
       placeholder="Days"
       value={days}
       name="days"
     />
     <div className="input-group mb-2 mr-sm-2">
       <input
         type="text"
         className="form-control"
         placeholder="Speed"
         value={speed}
         name="speed"
       />
     </div>
     <button type="submit" className="btn btn-primary mb-2 pxy-4">Save</button>
   </form>
 </div>
);

StakeItem.propTypes = {
 days: PropTypes.string.isRequired,
 speed: PropTypes.string.isRequired,
};