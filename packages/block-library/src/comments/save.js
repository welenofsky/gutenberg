/**
 * WordPress dependencies
 */
import { useInnerBlocksProps, useBlockProps } from '@wordpress/block-editor';
import { Children } from '@wordpress/element';

export default function save( { attributes: { tagName: Tag } } ) {
	const blockProps = useBlockProps.save();
	const innerBlocksProps = useInnerBlocksProps.save( blockProps );

	// The `save` function always returns a RawHTML element wrapping the
	// serialized content. We check whether the serialized content is empty or
	// not.
	const rawHTML = Children.only( innerBlocksProps.children );
	if ( ! rawHTML.props.children ) {
		return null;
	}

	return <Tag { ...innerBlocksProps } />;
}
