import type {NextApiRequest, NextApiResponse} from 'next';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import mutations from '../../../constants/GraphQL/SignIn/mutations';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {data: signUpData} = await graphqlRequestHandler(
      mutations.generateSignUpOtp,
      {
        email: req.body?.email,
        fullName: req.body?.fullName,
      },
      process.env.BACKEND_API_KEY
    );

    if (signUpData.data.generateSignUpOtp?.status === 409) {
      res.status(409).send({message: 'Email Already in Use'});
      return;
    }

    res.status(200).send({message: 'OTP SignUp Response', signUpData});
  } catch (err) {
    res.status(500).send({message: 'Unknown Server Error', error: 'Unknown Server Error'});
  }
};

export default handler;
