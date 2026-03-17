import React, { Suspense, useState } from "react";
import { CandidateType } from "types";
import { Button, Flex, Modal, Spin, Tooltip, Typography } from "antd";
import { useGetCandidateLeader } from "hooks/eizbori-hooks/useGetCandidateLeader";
import { Candidate, VotesFormVoditelji } from "@components";
import { useGetIsVoted } from "hooks/eizbori-hooks/useGetIsVoted";
import { Elections } from "types/VotesTypes";

interface Props {
  elections: Elections;
}

const ElectionsVoditelji = ({ elections }: Props) => {
  const { data: candidateLeader } = useGetCandidateLeader();
  const { data: isVoted } = useGetIsVoted();

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Flex justify="space-between" align="center">
        <Typography.Title level={3} style={{ color: "white" }}>
          Kandidati za voditelje
        </Typography.Title>

        <>
          {elections?.vote_active ? (
            <>
              <Tooltip title={isVoted?.message}>
                <Button
                  type="primary"
                  size="large"
                  className="addButton"
                  onClick={() => setIsModalOpen(true)}
                  disabled={isVoted?.is_voted}
                >
                  Glasaj
                </Button>
              </Tooltip>
              <Modal
                title="Glasaj"
                style={{ top: "40px" }}
                open={isModalOpen}
                footer={null}
                cancelText="Poništi"
                onOk={() => setIsModalOpen(false)}
                onCancel={() => {
                  setIsModalOpen(false);
                }}
                destroyOnClose={true}
              >
                <Suspense fallback={<Spin size="small" />}>
                  <VotesFormVoditelji
                    candidateData={candidateLeader}
                    setIsModalOpen={setIsModalOpen}
                  />
                </Suspense>
              </Modal>{" "}
            </>
          ) : (
            <Typography.Title level={5} style={{ color: "white" }}>
              Glasanje još nije aktivno
            </Typography.Title>
          )}
        </>
      </Flex>
      <Flex gap="small" wrap="wrap">
        {candidateLeader?.map((candidate: CandidateType) => (
          <Candidate candidate={candidate} key={candidate?.id} />
        ))}
      </Flex>
    </>
  );
};
export default ElectionsVoditelji;
