import React from 'react';
import { bool, func, object, shape, string } from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from '../../util/reactIntl';
import { ensureAvailabilityException, ensureOwnListing } from '../../util/data';
import { LISTING_STATE_DRAFT } from '../../util/types';
import { ListingLink } from '../../components';
import { EditListingAvailabilityForm } from '../../forms';
import css from './EditListingAvailabilityPanel.css';
const moment = require('moment');

//const saveAvailabilityTimes = (availableFromTimestamp, availableTillTimestamp) => {
//  const availTimes = { availableFromTimestamp: availableFromTimestamp,
//                           availableTillTimestamp: availableTillTimestamp };
//  window.localStorage.setItem("availabilityTimes", JSON.stringify(availTimes));
//};

const EditListingAvailabilityPanel = props => {
  const {
    className,
    rootClassName,
    listing,
    availability,
    onSubmit,
    onChange,
    submitButtonText,
    panelUpdated,
    updateInProgress,
    errors,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureOwnListing(listing);
  const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
  /*const defaultAvailabilityPlan = {
    type: 'availability-plan/time',
    timezone: 'Canada/Eastern',
    entries: [
      { dayOfWeek: 'mon', seats: 1, startTime: '09:00', endTime: '18:00' },
      { dayOfWeek: 'tue', seats: 1, startTime: '09:00', endTime: '18:00' },
      { dayOfWeek: 'wed', seats: 1, startTime: '09:00', endTime: '18:00' },
      { dayOfWeek: 'thu', seats: 1, startTime: '09:00', endTime: '18:00' },
      { dayOfWeek: 'fri', seats: 1, startTime: '09:00', endTime: '18:00' },
      { dayOfWeek: 'sat', seats: 1, startTime: '09:00', endTime: '18:00' },
      { dayOfWeek: 'sun', seats: 1, startTime: '09:00', endTime: '18:00' },
    ],
  };*/
  const defaultAvailabilityPlan = {
    type: 'availability-plan/day',
    //timezone: 'Canada/Eastern',
    entries: [
      { dayOfWeek: 'mon', seats: 1 },
      { dayOfWeek: 'tue', seats: 1 },
      { dayOfWeek: 'wed', seats: 1 },
      { dayOfWeek: 'thu', seats: 1 },
      { dayOfWeek: 'fri', seats: 1 },
      { dayOfWeek: 'sat', seats: 1 },
      { dayOfWeek: 'sun', seats: 1 },
    ],
  };
  const availabilityPlan = currentListing.attributes.availabilityPlan || defaultAvailabilityPlan;

  const defaultAvailabilityTimes =
    { availableFromTimestamp: 60 * 60 * 1, availableTillTimestamp: 60 * 60 * 23 };
  let availabilityTimes;
  if(currentListing && currentListing.attributes && currentListing.attributes.publicData &&
     currentListing.attributes.publicData.availabilityTimes &&
     typeof currentListing.attributes.publicData.availabilityTimes.availableFromTimestamp !== 'undefined' &&
     typeof currentListing.attributes.publicData.availabilityTimes.availableTillTimestamp !== 'undefined')
  {
    availabilityTimes = currentListing.attributes.publicData.availabilityTimes;
  } else {
    availabilityTimes = defaultAvailabilityTimes;
  }

  //saveAvailabilityTimes(availabilityTimes.availableFromTimestamp, availabilityTimes.availableTillTimestamp);

  return (
    <div className={classes}>
      <h1 className={css.title}>
        {isPublished ? (
          <FormattedMessage
            id="EditListingAvailabilityPanel.title"
            values={{ listingTitle: <ListingLink listing={listing} /> }}
          />
        ) : (
          <FormattedMessage id="EditListingAvailabilityPanel.createListingTitle" />
        )}
      </h1>
      <EditListingAvailabilityForm
        className={css.form}
        listingId={currentListing.id}
        initialValues={{ availabilityPlan, availabilityTimes }}
        availability={availability}
        availabilityPlan={availabilityPlan}
        availabilityTimes={availabilityTimes}
        onSubmit={(values) => {
          let { timeFrom, timeTo } = values;
          timeFrom = timeFrom || "01:00 AM";
          timeTo = timeTo || "11:00 PM";
          const timeFromObj = moment.utc(timeFrom, "hh:mm A");
          const timeToObj = moment.utc(timeTo, "hh:mm A");
          const secondsFrom = timeFromObj.hours() * 3600 + timeFromObj.minutes() * 60 + timeFromObj.seconds();
          let secondsTo = timeToObj.hours() * 3600 + timeToObj.minutes() * 60 + timeToObj.seconds();
          if(secondsTo <= secondsFrom){
            secondsTo = secondsFrom + 1800;
          }
          const newAvailabilityTimes = { availableFromTimestamp: secondsFrom,
                                         availableTillTimestamp: secondsTo };
          // saveAvailabilityTimes(secondsFrom, secondsFrom);
          // We save the default availability plan
          // I.e. this listing is available every night.
          // Exceptions are handled with live edit through a calendar,
          // which is visible on this panel.
          onSubmit({ availabilityPlan: availabilityPlan, publicData: { availabilityTimes: newAvailabilityTimes }});
        }}
        onChange={onChange}
        saveActionMsg={submitButtonText}
        updated={panelUpdated}
        updateError={errors.updateListingError}
        updateInProgress={updateInProgress}
      />
    </div>
  );
};

EditListingAvailabilityPanel.defaultProps = {
  className: null,
  rootClassName: null,
  listing: null,
};

EditListingAvailabilityPanel.propTypes = {
  className: string,
  rootClassName: string,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,

  availability: shape({
    calendar: object.isRequired,
    onFetchAvailabilityExceptions: func.isRequired,
    onCreateAvailabilityException: func.isRequired,
    onDeleteAvailabilityException: func.isRequired,
  }).isRequired,
  onSubmit: func.isRequired,
  onChange: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  updateInProgress: bool.isRequired,
  errors: object.isRequired,
};

export default EditListingAvailabilityPanel;
