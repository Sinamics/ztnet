import InputField from "~/components/elements/inputField";
import {
	useTrpcApiErrorHandler,
	useTrpcApiSuccessHandler,
} from "~/hooks/useTrpcApiHandler";
import { api } from "~/utils/api";
import { UserRolesList } from "~/utils/role";

interface Iprops {
	organizationId: string;
}

const InviteByMail = ({ organizationId }: Iprops) => {
	const handleApiError = useTrpcApiErrorHandler();
	const handleApiSuccess = useTrpcApiSuccessHandler();

	const { refetch: refetchInvites } = api.org.getInvites.useQuery({
		organizationId,
	});

	const { mutate: inviteUserByMail } = api.org.inviteUserByMail.useMutation({
		onSuccess: () => {
			refetchInvites();
		},
	});

	return (
		<div>
			<p className="text-xl upp">Invite by mail</p>
			<p className="text-sm text-gray-400 ">
				Invited users who are not currently members of the application will need to
				register through the provided link in the invitation email. Token is valid for 1
				hour.
			</p>
			<InputField
				isLoading={false}
				label=""
				openByDefault={true}
				showCancelButton={false}
				showSubmitButtons={true}
				rootFormClassName="space-y-3 pt-2 "
				rootClassName="flex flex-col space-y-10"
				labelClassName="text-gray-600"
				size="sm"
				fields={[
					{
						name: "organizationId",
						type: "hidden",
						value: organizationId,
					},
					{
						name: "email",
						type: "text",
						description: "Enter the mail address of the user you want to invite",
						placeholder: "Email Address",
						// value: options?.smtpPort,
					},
					{
						name: "role",
						elementType: "select",
						placeholder: "user role",
						description: "Select the role of the user",
						initialValue: "READ_ONLY",
						selectOptions: UserRolesList,
					},
				]}
				submitHandler={(params) => {
					return new Promise(() => {
						return inviteUserByMail(
							{ ...params },
							{
								onSuccess: handleApiSuccess,
								onError: handleApiError,
							},
						);
					});
				}}
			/>
		</div>
	);
};

export default InviteByMail;
