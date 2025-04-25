import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-light py-4 mt-auto">
      <div className="container-fluid">
        <div className="d-flex flex-wrap justify-content-between align-items-center">
          <div className="col-md-6 d-flex align-items-center">
            <span className="text-muted">© 2025 SkillWave. All rights reserved.</span>
          </div>
          <ul className="nav col-md-6 justify-content-end list-unstyled d-flex">
            <li className="ms-3"><a className="text-muted" href="#!">Terms</a></li>
            <li className="ms-3"><a className="text-muted" href="#!">Privacy</a></li>
            <li className="ms-3"><a className="text-muted" href="#!">Help</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;