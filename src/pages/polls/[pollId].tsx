import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { api } from "../../utils/api";

const PollPage: NextPage = () => {
  const router = useRouter();
  const pollId = router.query.pollId as string;
  const [selectedAnswerId, setSelectedAnswerId] = useState<
    string | undefined
  >();
  const [hasAnswered, setHasAnswered] = useState(false);

  const pollResponse = api.poll.getPoll.useQuery(
    {
      pollId,
    },
    {
      refetchInterval: 5000,
      enabled: !!pollId,
    }
  );

  const submitResponse = api.poll.submitResponse.useMutation();

  const poll = pollResponse.data;

  useEffect(() => {
    setHasAnswered(!!localStorage.getItem(pollId));
  }, [pollId]);

  function handlePollSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedAnswerId) return;
    setHasAnswered(true);
    submitResponse
      .mutateAsync({
        answerId: selectedAnswerId,
      })
      .then(() => {
        localStorage.setItem(pollId, "true");
        return pollResponse.refetch();
      })
      .catch(console.error);
  }

  const totalResponses = poll?.answers.reduce(
    (sum, answer) => sum + answer._count.responses,
    0
  );

  function getWidth(count: number) {
    return (count / (totalResponses || 1)) * 400;
  }

  return (
    <>
      <Head>
        <title>Answer a Poll</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        {pollResponse.isLoading ? (
          <>Loading...</>
        ) : (
          <section className="flex flex-col gap-4">
            <h1 className="text-4xl">{poll?.prompt}</h1>

            {hasAnswered ? (
              <ul className="flex flex-col gap-2">
                {poll?.answers.map((answer) => (
                  <>
                    <li key={answer.id} className="">
                      {answer.text}: {answer._count.responses} votes
                    </li>
                    <div
                      className=" h-6 bg-gray-500"
                      style={{
                        width: `${getWidth(answer._count.responses)}px`,
                      }}
                    ></div>
                  </>
                ))}
              </ul>
            ) : (
              <form className="flex flex-col gap-4" onSubmit={handlePollSubmit}>
                {poll?.answers.map((answer) => {
                  const inputId = `input-${answer.id}`;
                  return (
                    <fieldset key={answer.id} className="flex gap-2">
                      <input
                        id={inputId}
                        type="radio"
                        checked={selectedAnswerId === answer.id}
                        onChange={() => setSelectedAnswerId(answer.id)}
                      />
                      <label htmlFor={inputId}>{answer.text}</label>
                    </fieldset>
                  );
                })}
                <button
                  className="bg-blue-400 px-3 py-2 text-white hover:bg-blue-500 disabled:bg-gray-700 disabled:hover:bg-gray-700"
                  disabled={!selectedAnswerId}
                >
                  Submit
                </button>
              </form>
            )}
          </section>
        )}
      </main>
    </>
  );
};

export default PollPage;
