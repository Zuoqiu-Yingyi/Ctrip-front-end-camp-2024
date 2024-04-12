// Copyright 2024 wu
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import { Modal, Form, Input } from "antd";
import { useTranslation } from "react-i18next";

const { TextArea } = Input;

export default function RejectModal({isModalOpen, handleOk, handleCancel}: {isModalOpen: boolean, handleOk: any, handleCancel: any}): JSX.Element {
    
    const { t, i18n } = useTranslation();
    
    const [form] = Form.useForm();
    
    return (
        <Modal
            title={t("reject-reason")}
            open={isModalOpen}
            onOk={() => {handleOk(form.getFieldValue("reason"))}}
            onCancel={handleCancel}
            width={400}
            okText={t("confirmed")}
            cancelText={t("cancel")}
        >
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 24 }}
                layout="horizontal"
                style={{ maxWidth: 400 }}
                initialValues={{ operation: "pass" }}
                form={form}
            >
                <Form.Item
                    name="reason"
                >
                    <TextArea rows={5} />
                </Form.Item>
            </Form>
        </Modal>
    );
}
