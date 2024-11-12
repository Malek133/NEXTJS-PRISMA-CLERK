import { currentUser } from "@clerk/nextjs/server";


export default async function Home() {

  const user =  await currentUser() 
  const firstName =  user?.firstName;
  const id = user?.id;
  const Alphazero= firstName ? `${firstName},  ${id}` : ``;
  return (
    <div className="flex justify-center items-center text-4xl">
    Welcome <span className="text-xl mx-5">{Alphazero}</span>
    </div>
  );
}
