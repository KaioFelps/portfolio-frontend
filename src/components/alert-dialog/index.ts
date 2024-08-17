import Root from "./root.svelte";
import Trigger from "./trigger.svelte";
import Content from "./content.svelte";

import { AlertDialog } from "bits-ui";

export default {
	Root,
	Trigger,
	Content,
	Cancel: AlertDialog.Cancel,
	Action: AlertDialog.Action,
	Title: AlertDialog.Title,
	Description: AlertDialog.Description,
};
