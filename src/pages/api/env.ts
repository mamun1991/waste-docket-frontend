// pages/api/env.ts
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import type {NextApiRequest, NextApiResponse} from 'next';
import queries from '@/constants/GraphQL/Shared/queries';

type Data = {
  BACKEND_API_KEY?: string;
  JWT_SECRET?: string;
  JWT_ACCESS_TOKEN_SECRET?: string;
  BACKEND_JWT_SECRET?: string;
  SEND_GRID_API_KEY?: string;
  [key: string]: string | undefined;
};

async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    const {data} = await graphqlRequestHandler(
      queries.getEnvironmentVairables,
      {},
      req.query?.accessToken
    );
    const backendEnvironmentVariables = data?.data?.getEnvironmentVairables?.environmentVariables
      ? JSON.parse(data?.data?.getEnvironmentVairables?.environmentVariables)
      : {};
    const serverSideEnv: Data = {
      BACKEND_API_KEY: process.env.BACKEND_API_KEY,
      JWT_SECRET: process.env.JWT_SECRET,
      JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET,
      BACKEND_JWT_SECRET: process.env.BACKEND_JWT_SECRET,
      SEND_GRID_API_KEY: process.env.SEND_GRID_API_KEY,
      ...backendEnvironmentVariables,
    };

    res.status(200).json(serverSideEnv);
  } catch (error) {
    console.error('Error fetching server-side env variables:', error);
    res.status(500).json({message: 'Internal Server Error'});
  }
}

export default handler;
