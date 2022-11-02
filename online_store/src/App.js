import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import IMG_SHIRT from './shirt.gif';
import Container from '@mui/material/Container';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import SubdirectoryArrowLeftIcon from '@mui/icons-material/SubdirectoryArrowLeft';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import { ReactComponent as IMG_MONERO  } from './monero.svg';
import TextField from '@mui/material/TextField';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Icon from '@mui/material/Icon';
import InputAdornment from '@mui/material/InputAdornment';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SendIcon from '@mui/icons-material/Send';
import StorefrontIcon from '@mui/icons-material/Storefront';
import * as jose from 'jose'

const INVENTORY = [
    {
        item:'t-shirt',
        img: IMG_SHIRT,
        name: 'Really cool T-shirt',
        description:`Amazing T-shirt, must have, cool, meaningful. Don't ne uncool by not buying one.`
    }

];

function MediaControlCard( props ) {
    const theme = useTheme();


    return (
        <Card sx={{ display: 'flex' }}>
        <CardMedia
        component="img"
        sx={{ width: 151 }}
        image={ props.item.img }
        alt="Amazing product"
        />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
        <Typography component="div" variant="h5">
        { props.item.name }
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" component="div">
        { props.item.description  }
        </Typography>
        </CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>

        <TextField
        value={ props.quantity }
        label="Quantity"
        type="number"
        onChange={ ( e ) => props.callback(e.target.value) }
        InputProps={{
            inputProps: { min: 0, max: 10 },
                endAdornment: (
                    <IconButton onClick={ props.submit } >
                    <SubdirectoryArrowLeftIcon />
                    </IconButton>
                ),
        }}

        />
        </Box>
        </Box>
        </Card>
    );
}


function MenuAppBar( props ) {
    const [auth, setAuth] = React.useState(true);

    return (
        <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
        <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        Amazing Web Store!
        </Typography>
        <div>
        { props.context === CONTEXT_SHOP ?
            <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={ props.callback }
            color="inherit"
            >
            <ShoppingBasketIcon />
            </IconButton>
            : <IconButton
            size="large"
            color="inherit"
            onClick={ props.callback } >
            <StorefrontIcon />
            </IconButton>
        }
        </div>
        </Toolbar>
        </AppBar>
        </Box>
    );
}
const PUBLIC_KEY=`-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAu1w30OecfRCEbLC8/42K
qXyUv4iUz6ySMwUkuvruRgKhvIsmZq4/Gio/ZxGSBkV7QjdVEKx0GsYF+B0snKAF
J7YwvJyjG8pbwk2xv/88MuiRUXi3mzFr+Ihqbd4TzQ/EfBVRAaUdOvBLwtJdUreE
3r+NRHsXt0UvjrENKplojQ4LKNrDs6CcFHcYcW+GtKZCJpgrNbwYGn9ePywH/ygU
1dNQLlh/d+xFNAVnscp5mISxGEFJNykAwMT/Ner0gL2b4v6EqVxzi5iqpMd5/huX
fOvkX42FhpOf35v86XWz19knWy3LldPF2MJ4NIBB02yt6ZfogVjkUC2KmPbPiVTb
7QIDAQAB
-----END PUBLIC KEY-----`


const ALG = "RSA-OAEP-256";

function Checkout( props  ) {

    const [po, setPO] = React.useState( props.basket );
    const [ serialized , setSerialized ] = React.useState( "" );
    const items = ( props.basket );
    console.log( po  );

    async function encrypt( txt  ) {
        const _publicKey = await jose.importSPKI(  PUBLIC_KEY , ALG  )
        const jwe = await new jose.CompactEncrypt(
            new TextEncoder().encode( txt )
        )
            .setProtectedHeader({ alg: 'RSA-OAEP-256', enc: 'A256GCM' })
            .encrypt( _publicKey )

        setSerialized(jwe)

    }

    return (
        <>
        <h1>Checkout</h1>

        <List>{ Object.keys( items ).map( ( v,i ) => {

            return <ListItem disablePadding >
                <ListItemIcon>
                <Icon  style={{ width:`3em`,height:`3em` }}  >
                <img style={{height:`100%`,textAlign:`center`}} src={ items[v]["img"] } />
                </Icon>
                </ListItemIcon>
                <ListItemText primary={ items[v]["qty"] + " : " + v } />
                </ListItem>




        } ) } </List>

        <TextField
        fullWidth
        label="Transaxtion ID"
        onKeyUp={ e => setPO( { ... po , ... { txn : e.target.value } } ) }
        onBlur={ e => setPO( { ... po , ... { txn : e.target.value } } ) }
        InputProps={{

            startAdornment: (
                <InputAdornment position="start">
                <SvgIcon component={ IMG_MONERO  }  inheritViewBox />
                </InputAdornment>
            ),
        }}


        />
        <br/>
        <br/>
        <TextField
        fullWidth
        label="Address line#1"
        onKeyUp={ e => setPO( { ... po , ... { address1 : e.target.value } } ) }
        onBlur={ e => setPO( { ... po , ... { address1 : e.target.value } } ) }

        />
        <br/>
        <br/>
        <TextField
        fullWidth
        label="Address line#2"
        onKeyUp={ e => setPO( { ... po , ... { address2 : e.target.value } } ) }
        onBlur={ e => setPO( { ... po , ... { address2 : e.target.value } } ) }

        />
        <br/>
        <br/>
        <TextField
        fullWidth
        label="Post/Zip Code"
        onKeyUp={ e => setPO( { ... po , ... { postCode : e.target.value } } ) }
        onBlur={ e => setPO( { ... po , ... { postCode : e.target.value } } ) }

        />
        <br/>
        <br/>
        <TextField
        fullWidth
        label="Country"
        onKeyUp={ e => setPO( { ... po , ... { country : e.target.value } } ) }
        onBlur={ e => setPO( { ... po , ... { country : e.target.value } } ) }

        />
        <br/>
        <br/>
        {
            po["txn"] && po["address1"] && po["address2"] && po["postCode"] && po["country"] &&
            <Button variant="contained" onClick={ e => encrypt( JSON.stringify( po ) ) } >Encrypt</Button> }

        { serialized && <Card>
                < div style={{float:`right`}}>
                <IconButton >
                <ContentCopyIcon />
                </IconButton>
                </div>

                { serialized }

                </Card> }



        </>
    );
}



const CONTEXT_SHOP = "shop";
const CONTEXT_CHECKOUT = "checkout";

function App() {

    const [ quantity , setQuantity ] = React.useState( 0 );
    const [ context , setContext ] = React.useState( CONTEXT_SHOP );
    const [ basket , setBasket ] = React.useState( { "t-shirt": {  qty: 0,img:IMG_SHIRT } } );

    function updateQty( v ) {
        setQuantity(  v );
    }

    function toggleContext( ) {
        setContext( context === CONTEXT_SHOP ? CONTEXT_CHECKOUT : CONTEXT_SHOP );
    }

    return (
        <div className="App">
        <MenuAppBar callback={ toggleContext }  context={ context } />
        <Container maxWidth="sm">
        <br/>
        {
            context === CONTEXT_SHOP ?
            <>{ INVENTORY.map( (v,i) => <MediaControlCard item={ v } key={ i } quantity={ quantity } callback={ updateQty } submit={ e => setBasket({ "t-shirt":{qty: quantity,img: IMG_SHIRT } } ) }  /> ) }</> : <Checkout basket={ basket } />
            }
            </Container>
            </div>
        );
        }

        export default App;
