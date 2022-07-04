/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { header as headerIcon, footer as footerIcon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import NewHeader from './new-header';
import NewFooter from './new-footer';

export default [
	{
		id: 'new-header',
		title: __( 'New Header' ),
		icon: headerIcon,
		flow: NewHeader,
	},
	{
		id: 'new-footer',
		title: __( 'New Footer' ),
		icon: footerIcon,
		flow: NewFooter,
	},
];
