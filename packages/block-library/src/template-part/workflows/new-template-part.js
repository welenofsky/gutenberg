/**
 * External dependencies
 */
import { kebabCase } from 'lodash';

/**
 * WordPress dependencies
 */
import {
	__experimentalBlockPatternsList as BlockPatternsList,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { parse, serialize } from '@wordpress/blocks';
import { Modal } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { useAsyncList } from '@wordpress/compose';
import { useDispatch, useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	useAlternativeTemplateParts,
	useTemplatePartArea,
} from '../edit/utils/hooks';
import { createTemplatePartId } from '../edit/utils/create-template-part-id';

function createTemplatePartPostData(
	area,
	blocks = [],
	title = __( 'Untitled Template Part' )
) {
	// Currently template parts only allow latin chars.
	// Fallback slug will receive suffix by default.
	const cleanSlug =
		kebabCase( title ).replace( /[^\w-]+/g, '' ) || 'wp-custom-part';

	// If we have `area` set from block attributes, means an exposed
	// block variation was inserted. So add this prop to the template
	// part entity on creation. Afterwards remove `area` value from
	// block attributes.
	return {
		title,
		slug: cleanSlug,
		content: serialize( blocks ),
		// `area` is filterable on the server and defaults to `UNCATEGORIZED`
		// if provided value is not allowed.
		area,
	};
}

export default function NewTemplatePartWorkflow( {
	area,
	onFinish,
	rootClientId,
	onSelect,
} ) {
	const { saveEntityRecord } = useDispatch( coreStore );
	const areaObject = useTemplatePartArea( area );

	const { templateParts } = useAlternativeTemplateParts( area );

	const templartPartsAsBlockPatterns = useMemo( () => {
		return templateParts.map( ( templatePart ) => ( {
			name: createTemplatePartId( templatePart.theme, templatePart.slug ),
			title: templatePart.title.rendered,
			blocks: parse( templatePart.content.raw ),
			templatePart,
		} ) );
	}, [ templateParts ] );

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

	const shownTemplateParts = useAsyncList( templartPartsAsBlockPatterns );
	const shownBlockPatterns = useAsyncList( blockPatterns );

	return (
		<Modal
			className="block-editor-template-part__selection-modal"
			title={ sprintf(
				// Translators: %s as template part area title ("Header", "Footer", etc.).
				__( 'Choose a %s' ),
				areaObject?.label.toLowerCase() ?? __( 'template part' )
			) }
			closeLabel={ __( 'Cancel' ) }
			onRequestClose={ onFinish }
		>
			<div>
				<h2>{ __( 'Existing template parts' ) }</h2>
				<BlockPatternsList
					blockPatterns={ templartPartsAsBlockPatterns }
					shownPatterns={ shownTemplateParts }
					onClickPattern={ ( pattern ) => {
						const focusBlock = true;
						onSelect(
							{
								name: 'core/template-part',
								initialAttributes: {
									slug: pattern.templatePart.slug,
									theme: pattern.templatePart.theme,
								},
							},
							focusBlock
						);
						onFinish();
					} }
				/>
			</div>
			<div>
				<h2>{ __( 'Patterns' ) }</h2>
				<BlockPatternsList
					blockPatterns={ blockPatterns }
					shownPatterns={ shownBlockPatterns }
					onClickPattern={ async ( pattern, blocks ) => {
						const templatePartPostData =
							await createTemplatePartPostData( area, blocks );

						const templatePart = await saveEntityRecord(
							'postType',
							'wp_template_part',
							templatePartPostData
						);

						const focusBlock = true;
						onSelect(
							{
								name: 'core/template-part',
								initialAttributes: {
									slug: templatePart.slug,
									theme: templatePart.theme,
								},
							},
							focusBlock
						);
						onFinish();
					} }
				/>
			</div>
		</Modal>
	);
}
