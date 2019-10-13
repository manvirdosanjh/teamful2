import React from 'react';
import { FormattedMessage, intlShape } from '../../util/reactIntl';
// eslint-disable-next-line
import { LINE_ITEM_NIGHT, LINE_ITEM_DAY, propTypes } from '../../util/types';

import css from './BookingBreakdown.css';
//import { formatMoney } from '../../util/currency';

const LineItemPersonsMaybe = props => {
  // eslint-disable-next-line
  const { transaction, bookingData, intl } = props;

  let quantityEnsured = 1;
  if(bookingData && bookingData.quantity)
  {
    quantityEnsured = bookingData.quantity;
  } else if(transaction && transaction.attributes && transaction.attributes.payinTotal
            && transaction.attributes.payinTotal.amount)
  {
    const unitPurchase = transaction.attributes.lineItems.find(
      item => item.code === LINE_ITEM_DAY && !item.reversal
    );

    const unitPrice = unitPurchase.unitPrice.amount;
    const payinAmount = transaction.attributes.payinTotal.amount;
    quantityEnsured = payinAmount / unitPrice;
  }

  return (
    <div className={css.lineItem}>
      <span className={css.itemLabel}>
        <FormattedMessage id={"LineItemPersonsMaybe.numberOfPersons"} />
      </span>
      <span className={css.itemValue}>{quantityEnsured}</span>
    </div>
  );
};

LineItemPersonsMaybe.propTypes = {
  transaction: propTypes.transaction.isRequired,
  intl: intlShape.isRequired,
};

export default LineItemPersonsMaybe;
