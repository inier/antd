import constants from '@/constants';
import {
    LockOutlined,
    UserOutlined
} from '@ant-design/icons';
import {
    LoginForm,
    ProFormText
} from '@ant-design/pro-components';

export default function Login() {
    return (
        <div className='flex justify-center pt-[20vh]'>
            <div className='h-[320px] bg-card rounded-lg [&>.ant-pro-form-login-container]:rounded [&_.ant-pro-form-login-desc]:mb-5'>
                <LoginForm
                    title={constants.name}
                    subTitle={constants.description}
                >
                    <ProFormText
                        name="username"
                        fieldProps={{
                            size: 'large',
                            prefix: <UserOutlined className={'prefixIcon'} />,
                        }}
                        placeholder={'请输入用户名'}
                        rules={[
                            {
                                required: true,
                                message: '请输入用户名',
                            },
                        ]}
                    />
                    <ProFormText.Password
                        name="password"
                        fieldProps={{
                            size: 'large',
                            prefix: <LockOutlined className={'prefixIcon'} />,
                        }}
                        placeholder={'请输入密码'}
                        rules={[
                            {
                                required: true,
                                message: '请输入密码',
                            },
                        ]}
                    />
                </LoginForm>
            </div>
        </div>
    );
};