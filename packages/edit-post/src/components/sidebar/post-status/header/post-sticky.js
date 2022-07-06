/**
 * WordPress dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';
import { MenuItem } from '@wordpress/components';
import { check } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

export default function PostSticky() {
	const sticky = useSelect(
		( select ) => select( editorStore ).getEditedPostAttribute( 'sticky' ),
		[]
	);

	const { editPost } = useDispatch( editorStore );

	return (
		<MenuItem
			icon={ sticky ? check : null }
			isSelected={ sticky }
			role="menuitemcheckbox"
			onClick={ () => {
				editPost( { sticky: ! sticky } );
			} }
		>
			{ __( 'Stick to the top' ) }
		</MenuItem>
	);
}
