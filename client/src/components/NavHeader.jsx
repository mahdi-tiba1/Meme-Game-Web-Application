import { Container, Navbar ,Nav} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LogoutButton } from './AuthComponents';

// UPDATED
function NavHeader (props) {
  return(
    <Navbar expand="lg" variant="dark" style={{backgroundColor: '#343a40'}}>
      <Container fluid>
        <Navbar.Brand as={Link} to="/" style={{color: '#fff', fontSize: '24px', fontWeight: 'bold'}}>MeMe Game</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          {props.loggedIn ? 
          <>
            <Nav className="ml-auto" style={{maxHeight: '100px'}}>
              <Nav.Link as={Link} to="/history" style={{color: '#fff'}}>History</Nav.Link>
              <LogoutButton logout={props.handleLogout} />
            </Nav>
          </> :
            <Nav className="ml-auto" style={{maxHeight: '100px'}}>
              <Nav.Link as={Link} to="/login" style={{color: '#fff'}}>Login</Nav.Link>
            </Nav>
          }
        </Navbar.Collapse>
      </Container>
    </Navbar>
);
}


 


export default NavHeader;