const {StatusCodes} = require('http-status-codes')

const {BookingService} = require('../services/index');
const { REMINDER_BINDING_KEY } = require('../config/serverConfig');
const { createChannel, publishMessage } = require('../utils/messageQueue');
const services = require('../services/index');

const bookingService = new BookingService();



class BookingController{
    constructor(){
    }

    async sendMessageToQueue(req, res){
        const channel = await createChannel();
        const payload = {
            data: {
                subject: 'This notification ia from queue',
                content: 'Some queue will subscribe this.',
                recepientEmail: 'ankitxrajpoot@gmail.com',
                notificationTime: '2024-07-12T02:19:00'
            },
            service: 'CREATE_TICKET'
        };
        publishMessage(channel, REMINDER_BINDING_KEY, JSON.stringify(payload));
        return res.status(200).json({
            message: 'Succesfully published the event'
        });
    }


    async create (req, res) {
        try {
            const response = await bookingService.createBooking(req.body);
            return res.status(StatusCodes.OK).json({
                message: 'Successfully completed booking',
                success: true,
                data: response,
                err: {}
            })
    
        } catch (error) {
            console.log(error);
            return res.status(error.statusCode).json({
                message: error.message,
                success: false,
                data: {},
                err: error.explanation
            })
        }
    }
}






module.exports = BookingController;