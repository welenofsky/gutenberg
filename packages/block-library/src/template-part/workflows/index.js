/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { symbolFilled as templatePartIcon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import NewTemplatePart from './new-template-part';

export default [
	{
		id: 'new-template-part',
		title: __( 'New Template Part' ),
		icon: templatePartIcon,
		flow: NewTemplatePart,
	},
];
