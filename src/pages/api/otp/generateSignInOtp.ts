import type {NextApiRequest, NextApiResponse} from 'next';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import mutations from '../../../constants/GraphQL/SignIn/mutations';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {data: signInData} = await graphqlRequestHandler(
      mutations.generateSignInOtp,
      {
        email: req.body.email,
      },
      process.env.BACKEND_API_KEY
    );

    if (signInData.data.generateSignInOtp?.status !== 200) {
      return res
        .status(signInData.data.generateSignInOtp?.status || 500)
        .send({message: signInData?.data?.generateSignInOtp?.message || 'Unknown Server Error'});
    } else {
      return res.status(200).send({message: 'OTP SignIn Response', signInData});
    }
  } catch (err) {
    return res.status(500).send({message: err?.message, error: 'Unknown Server Error'});
  }
};

export default handler;
