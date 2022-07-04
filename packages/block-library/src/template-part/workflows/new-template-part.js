/**
 * WordPress dependencies
 */
import {
	__experimentalBlockPatternsList as BlockPatternsList,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { Modal } from '@wordpress/components';
import { useAsyncList } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';

export default function NewTemplatePartWorkflow( {
	area,
	onFinish,
	rootClientId,
	insertBlocks,
} ) {
	const blockPatterns = useSelect(
		( select ) => {
			const blockNameWithArea = area
				? `core/template-part/${ area }`
				: 'core/template-part';
			const { __experimentalGetPatternsByBlockTypes } =
				select( blockEditorStore );
			return __experimentalGetPatternsByBlockTypes(
				blockNameWithArea,
				rootClientId
			);
		},
		[ area, rootClientId ]
	);
	const shownBlockPatterns = useAsyncList( blockPatterns );

	return (
		<Modal
			className="block-editor-template-part__new-header-workflow"
			title={ sprintf(
				// Translators: %s as template part area title ("Header", "Footer", etc.).
				__( 'Choose a %s' ),
				area?.label.toLowerCase() ?? __( 'template part' )
			) }
			closeLabel={ __( 'Cancel' ) }
			onRequestClose={ onFinish }
		>
			<BlockPatternsList
				blockPatterns={ blockPatterns }
				shownPatterns={ shownBlockPatterns }
				onClickPattern={ ( pattern, blocks ) => {
					insertBlocks( blocks );
				} }
			/>
		</Modal>
	);
}
