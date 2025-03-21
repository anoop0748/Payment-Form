import React, { useState } from 'react';
import success from '../assets/success.jpg';
import failed from '../assets/failed.jpg';
import './payment.css'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';

function PaymentForm() {
    const [open, setOpen] = useState(false);
    const [to, setTo] = useState('');
    const [from, setFrom] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [amountError, setAmountError] = useState(false);
    const [resultDialogOpen, setResultDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [result, setResult] = useState('')

    const handleClickOpen = () => {
        setOpen(!open);
    };

    const handleClose = () => {
        setOpen(false);
        setTo('');
        setFrom('');
        setAmount('');
        setDescription('');
        setEmailError(false);
        setAmountError(false);
        setErrorMessage('');
    };

    const handleToChange = (event) => {
        const value = event.target.value;
        setTo(value);
        setEmailError(!isValidEmail(value));
    };

    const handleFromChange = (event) => {
        setFrom(event.target.value);
    };

    const handleAmountChange = (event) => {
        const value = event.target.value;
        setAmount(value);
        setAmountError(!isValidAmount(value));
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleSubmit = async () => {
        if (isValidEmail(to) && isValidAmount(amount) && from) {
            try {
                const response = await sendPayment({ to, from, amount, description });
                if (response.status === 200) {
                    setErrorMessage('Your payment has been processed successfully.');
                    setResult('success');
                }
                if (response.status === 400) {
                    setErrorMessage('Bad Request: Invalid payment details.');
                    console.log(errorMessage)
                    setResult('error');
                } else if (response.status === 401) {
                    setErrorMessage('Unauthorized access')
                    window.location.href = '/'
                    setResult('error');
                } else if (response.status >= 500) {
                    setErrorMessage('Server Error: Please try again later.');
                    setResult('error');
                }
                setResultDialogOpen(true);
            } catch (error) {
                setErrorMessage('Network error: Unable to connect to the server.');
                setResultDialogOpen(true);
            }
        }
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isValidAmount = (amount) => {
        const numericAmount = parseFloat(amount);
        return !isNaN(numericAmount) && numericAmount > 0;
    };

    const isSubmitDisabled = !to || !from || !amount || emailError || amountError;

    const handleSuccessDialogClose = () => {
        setResultDialogOpen(false);
        handleClose();
    };

    const sendPayment = async (paymentData) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const randomStatusCode = Math.floor(Math.random() * 5);
                let response = { ok: true, status: 200 };

                if (randomStatusCode == 0) {
                    response = { ok: false, status: 400 };
                } else if (randomStatusCode == 1) {
                    response = { ok: false, status: 401 };
                } else if (randomStatusCode == 2) {
                    response = { ok: false, status: 500 };
                }
                console.log(response)
                resolve(response);
            }, 1000);
        });
    };

    return (
        <div>
            <Button variant="contained" color="primary" onClick={handleClickOpen}>
                Payment Button
            </Button>
            {handleClickOpen ?
                <>
                    <Dialog open={open} >
                        <DialogTitle>Payment Details</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="to"
                                label="To (Email)"
                                type="email"
                                fullWidth
                                variant="standard"
                                value={to}
                                onChange={handleToChange}
                                error={emailError}
                                helperText={emailError ? 'Invalid email format' : ''}
                            />
                            <FormControl fullWidth margin="dense">
                                <InputLabel id="from-label">From</InputLabel>
                                <Select
                                    labelId="from-label"
                                    id="from"
                                    value={from}
                                    label="From"
                                    onChange={handleFromChange}
                                >
                                    <MenuItem value="BTC">BTC</MenuItem>
                                    <MenuItem value="ETH">ETH</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                margin="dense"
                                id="amount"
                                label="Amount"
                                type="number"
                                fullWidth
                                variant="standard"
                                value={amount}
                                onChange={handleAmountChange}
                                error={amountError}
                                helperText={amountError ? 'Invalid amount' : ''}
                            />
                            <TextField
                                margin="dense"
                                id="description"
                                label="Description (Optional)"
                                type="text"
                                fullWidth
                                variant="standard"
                                value={description}
                                onChange={handleDescriptionChange}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button onClick={handleSubmit} disabled={isSubmitDisabled}>
                                Submit
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={resultDialogOpen} onClose={handleSuccessDialogClose}>
                        < img className='popImgLogo' src={result === 'success' ? success : failed} alt='popUpImage' />
                        <DialogTitle color={result === 'success' ? 'success' : 'error'}>
                            {result === 'success' ? 'Payment Successful' : 'Payment Failed'}
                        </DialogTitle>
                        <DialogContent color={result === 'success' ? 'success' : 'error'}>
                            <p>
                                {errorMessage}
                            </p>
                        </DialogContent>

                        <DialogActions>
                            <Button onClick={handleSuccessDialogClose}>OK</Button>
                        </DialogActions>
                    </Dialog>
                </>
                : ""
            }
        </div>
    );
}

export default PaymentForm;