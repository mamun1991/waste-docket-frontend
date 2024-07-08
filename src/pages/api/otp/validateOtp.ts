import type {NextApiRequest, NextApiResponse} from 'next';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import mutations from '../../../constants/GraphQL/SignIn/mutations';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {data: validateData} = await graphqlRequestHandler(
      mutations.validateOtp,
      {
        email: req.body?.email,
        otpToken: req.body?.otpToken,
      },
      process.env.BACKEND_API_KEY
    );

    if (validateData.data.validateOtp.status === 400) {
      res.status(400).send({message: 'Invalid OTP - Please check your OTP and try again'});
      return;
    }

    res.status(200).send({message: 'OTP Token Response', validateData});
  } catch (err) {
    console.log(err);
    res.status(500).send({message: 'Unknown Server Error', error: 'Unknown Server Error'});
  }
};

export default handler;
