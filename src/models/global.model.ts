
import constants from "@/constants";
import { proxy } from "valtio";

interface UserInfo {
	nickname: string;
	email: string;
	avatar?: string;
}

interface SettingInfo {
	logo: string;
	name: string;
}

const state = proxy<{ user: UserInfo; setting: SettingInfo }>({
	user: {
		nickname: "Roy Lin",
		email: "admin@elljs.com",
		avatar: "https://avatars.githubusercontent.com/u/19965768?v=4",
	},
	setting: {
		logo: "https://github.githubassets.com/favicons/favicon.png",
		name: constants.name
	}
});

const actions = {
	load: async () => {
		const user = state.user;
		return { user };
	},
	login: async () => {
		window.location.href = "/";
	},
	logout: async () => {
		window.location.href = "/login";
	},
};

export default {
	state,
	...actions,
};
