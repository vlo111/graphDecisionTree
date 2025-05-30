import React, { useState } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

import Owner from './partials/Owner';

import 'react-bootstrap-typeahead/css/Typeahead.css';
import Collaborators from './partials/Collaborators';
import Search from './partials/Search';
import { ReactComponent as CloseSvg } from '../../assets/images/icons/close.svg';
import Button from '../form/Button';

const ShareModal = React.memo(({ graph, closeModal }) => {
  const [select, setSelect] = useState([]);
  const [sharedUsers, setShardUsers] = useState([]);
  const afterOpenModal = () => {};
  return (isEmpty(graph) ? null
    : (
      <Modal
        isOpen
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        contentLabel="Share"
        style={{
          overlay: {
            zIndex: 10
          },
        }}
      >
        <div className='share-modal__title'>
          <h3>Collaborators</h3>
          <Button
            icon={<CloseSvg style={{ height: 30 }} />}
            onClick={() => closeModal()}
            className="transparent"
          />
        </div>
        <Owner user={graph.user} />
        {select && <Collaborators graph={graph} select={select} />}
        <Search select={select} setSelect={setSelect} user={graph.user} closeModal={closeModal} />
      </Modal>
    )
  );
});

ShareModal.propTypes = {
  graph: PropTypes.object.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default ShareModal;
