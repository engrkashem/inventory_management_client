import { Button, Col, Divider, Form, Input, Row } from 'antd';
import { Controller, FieldValues, SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import INVForm from '../../components/Form/INVForm';
import INVInput from '../../components/Form/INVInput';
import INVSelect from '../../components/Form/INVSelect';
import Loading from '../../components/ui/Loading';
import { genderOptions } from '../../constants';
import { getCurrentToken } from '../../redux/features/auth/authSlice';
import {
  useGetMeQuery,
  useHostToImgBBMutation,
  useUpdateMyProfileMutation,
} from '../../redux/features/user/userApi';
import { useAppSelector } from '../../redux/hooks';
import { TCreateResponse, TUser } from '../../types';

export default function UpdateProfile() {
  // get current user token
  const token = useAppSelector(getCurrentToken);

  // fetch profile info
  const { data: profileInfo } = useGetMeQuery(undefined, { skip: !token });

  // update profile
  const [updateProfile] = useUpdateMyProfileMutation();
  const [hostToImgBB] = useHostToImgBBMutation();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const toastId = toast.loading('Your profile is Creating');
    // console.log(data, data.profilePic);
    const image = data.profilePic;
    const formData = new FormData();
    formData.append('image', image);

    const updatedProfileData = { ...data };

    try {
      // imhBB key from .env file
      // const imgBBKey = import.meta.env.VITE_IMGBB_KEY;

      // const response = (await hostToImgBB({
      //   data: formData,
      //   key: imgBBKey,
      // })) as any;
      // console.log(response);

      // if (response.success) {
      //   const imgUrl = response.data.url;
      //   updateProfile.profilePic = imgUrl;
      // }

      // const res = (await updateProfile(updateProfile, {
      //   skip: !response.success,
      // })) as TCreateResponse<TUser>;

      const res = (await updateProfile(
        updateProfile
      )) as TCreateResponse<TUser>;

      // console.log(res);

      if (res?.error) {
        toast.error(res?.error?.data?.message, {
          id: toastId,
        });
      } else {
        toast.success(res?.data?.message, { id: toastId });
      }
    } catch {
      toast.error('Something went wrong! Failed to Update profile', {
        id: toastId,
      });
    }
  };

  if (!profileInfo)
    return (
      <Row>
        <Col span={24}>
          <Loading />
        </Col>
      </Row>
    );

  return (
    <Row>
      <Col span={24}>
        <h1>Update Profile</h1>
        <INVForm onSubmit={onSubmit}>
          {/* Personal Info. */}
          <Divider>Personal Info.</Divider>
          <Row gutter={8}>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <INVInput
                type="text"
                label="First Name"
                name="name.firstName"
                defaultValue={profileInfo?.name?.firstName}
              />
            </Col>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <INVInput
                type="text"
                label="Middle Name"
                name="name.middleName"
                defaultValue={profileInfo?.name?.middleName}
              />
            </Col>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <INVInput
                type="text"
                label="Last Name"
                name="name.lastName"
                defaultValue={profileInfo?.name?.lastName}
              />
            </Col>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <INVSelect
                label="Gender"
                name="gender"
                options={genderOptions}
                defaultValue={profileInfo?.gender}
              />
            </Col>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <Controller
                name="profilePic"
                render={({ field: { onChange, value, ...field } }) => (
                  <Form.Item label="Profile Picture">
                    <Input
                      type="file"
                      value={value?.fileName}
                      {...field}
                      onChange={(e) => onChange(e.target.files?.[0])}
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>

          {/* Contact Info. */}
          <Divider>Contact Info.</Divider>
          <Row gutter={8}>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <INVInput
                type="email"
                label="Email"
                name="email"
                disabled={true}
                defaultValue={profileInfo?.email}
              />
            </Col>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <INVInput
                type="text"
                label="Contact No."
                name="contactNo"
                defaultValue={profileInfo?.contactNo}
              />
            </Col>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <INVInput
                type="text"
                label="Street"
                name="address.street"
                defaultValue={profileInfo?.address?.street}
              />
            </Col>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <INVInput
                type="text"
                label="District"
                name="address.district"
                defaultValue={profileInfo?.address?.district}
              />
            </Col>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <INVInput
                type="text"
                label="Division"
                name="address.division"
                defaultValue={profileInfo?.address?.division}
              />
            </Col>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <INVInput
                type="text"
                label="Country"
                name="address.country"
                defaultValue={profileInfo?.address?.country}
              />
            </Col>
          </Row>

          <Button htmlType="submit">Submit</Button>
        </INVForm>
      </Col>
    </Row>
  );
}
