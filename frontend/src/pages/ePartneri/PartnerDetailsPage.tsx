import React, { Suspense, useEffect } from "react";
import { NotesPerYearType, PartnersContactListType } from "@types";
import {
  Card,
  Collapse,
  Descriptions,
  Divider,
  Flex,
  Layout,
  List,
  Spin,
  Table,
  Tag,
} from "antd";
import { useParams } from "react-router-dom";
import "../../styles/epartneri.css";
import { usePartnerContactTable } from "@configurations";
import {
  AddNewContactsModal,
  AddNewNotesModal,
  DeleteContactsButton,
  DeleteNotesButton,
  EditContactModal,
  EditNotesButton,
  NoPermission,
} from "@components";
import { useUserContext } from "hooks/useUserContext";
import { useGetPartnerInfo } from "hooks/epartneri-hooks/useGetPartnerInfo";

const PartnerDetailsPage = () => {
  const { user } = useUserContext();
  if (!user?.permissions?.partneri) {
    return <NoPermission />;
  }

  const { partnerId } = useParams<{ partnerId: string }>();
  const {
    data: partnerInfo,
    isLoading,
    refetch,
  } = useGetPartnerInfo(partnerId);

  useEffect(() => {
    refetch();
  }, [partnerId]);

  const contactColumns = usePartnerContactTable(partnerInfo?.partner?.id);
  return (
    <Layout className="layoutHome">
      <Layout.Content className="container">
        <div className="footerSize">
          <Card
            title={partnerInfo?.partner?.brand_name}
            bordered={false}
            style={{ width: "100%", margin: "20px 0px" }}
            extra={
              <Suspense fallback={<Spin size="small" />}>
                <AddNewNotesModal partnerId={partnerInfo?.partner?.id} />
              </Suspense>
            }
          >
            <Descriptions
              className="containerShadow"
              bordered
              style={{ marginBottom: "20px" }}
            >
              <Descriptions.Item label="Pravno ime">
                {partnerInfo?.partner?.legal_name}
              </Descriptions.Item>
              <Descriptions.Item label="Ime Brenda">
                {partnerInfo?.partner?.brand_name}
              </Descriptions.Item>
              <Descriptions.Item label="OIB">
                {partnerInfo?.partner?.oib}
              </Descriptions.Item>
              <Descriptions.Item label="Adresa">
                {partnerInfo?.partner?.address}
              </Descriptions.Item>
              <Descriptions.Item label="Crna lista">
                {partnerInfo?.partner?.black_list
                  ? "Poduzeće se nalazi na crnoj list"
                  : "Poduzeće se ne nalazi na crnoj listi"}
              </Descriptions.Item>
            </Descriptions>
            <Card
              className="containerShadow"
              title={"Kontakti"}
              extra={
                <Suspense fallback={<Spin size="small" />}>
                  <AddNewContactsModal partnerId={Number(partnerId)} />
                </Suspense>
              }
            >
              {partnerInfo?.contacts?.map(
                (contact: PartnersContactListType, index: number) => (
                  <>
                    <Descriptions>
                      <Descriptions.Item label="Ime i prezime">
                        {contact?.name}
                      </Descriptions.Item>
                      <Descriptions.Item label="Email">
                        {contact?.email}
                      </Descriptions.Item>
                      <Descriptions.Item label="Pozicija">
                        {contact?.position}
                      </Descriptions.Item>
                      <Descriptions.Item label="Broj mobitela">
                        {contact?.phone_number}
                      </Descriptions.Item>
                    </Descriptions>
                    <Flex justify="flex-end">
                      <Suspense fallback={<Spin size="small" />}>
                        <EditContactModal contactData={contact} />
                        <DeleteContactsButton contactID={contact.id} />
                      </Suspense>
                    </Flex>
                    {index !== partnerInfo?.contacts?.length - 1 && <Divider />}
                  </>
                )
              )}
            </Card>

            <Collapse style={{ marginTop: "20px", textAlign: "left" }}>
              {partnerInfo?.notes?.map(
                (year: NotesPerYearType, index: number) => {
                  return year?.year_notes?.length != 0 ? (
                    <Collapse.Panel header={year?.academic_year} key={index}>
                      <List itemLayout="horizontal">
                        {year?.year_notes?.map((note) => (
                          <List.Item
                            key={note?.id}
                            actions={[
                              <Suspense fallback={<Spin size="small" />}>
                                <EditNotesButton
                                  notesData={note}
                                  partnerId={partnerInfo?.partner?.id}
                                />
                              </Suspense>,
                              <Suspense fallback={<Spin size="small" />}>
                                <DeleteNotesButton notesID={note!.id!} />
                              </Suspense>,
                            ]}
                          >
                            <List.Item.Meta
                              key={note?.id}
                              title={note?.project?.project_name}
                              description={`(${note?.date})  ` + note?.notes}
                            />
                          </List.Item>
                        ))}
                      </List>
                    </Collapse.Panel>
                  ) : null;
                }
              )}
            </Collapse>
          </Card>
        </div>
      </Layout.Content>
    </Layout>
  );
};
export default PartnerDetailsPage;
