/**
 * Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

// This file contains style definitions that can be used by CKEditor plugins.
//
// The most common use for it is the "stylescombo" plugin, which shows a combo
// in the editor toolbar, containing all styles. Other plugins instead, like
// the div plugin, use a subset of the styles on their feature.
//
// If you don't have plugins that depend on this file, you can simply ignore it.
// Otherwise it is strongly recommended to customize this file to match your
// website requirements and design properly.

CKEDITOR.stylesSet.add( 'default', [
	
	/* custom text styles */
	{
		name: 'Leader Text',
		element: 'p',
		attributes: {
			'class': 'leaderText'
		}
	},
	{
		name: 'Citation',
		element: 'p',
		attributes: {
			'class': 'cite'
		}
	},
	{
		name: 'Notes',
		element: 'p',
		attributes: {
			'class': 'note'
		}
	},
	{
		name: 'Quote',
		element: 'p',
		attributes: {
			'class': 'quote'
		}
	},
	{
		name: 'Reference',
		element: 'p',
		attributes: {
			'class': 'reference'
		}
	},
	{
		name: 'Title',
		element: 'p',
		attributes: {
			'class': 'title'
		}
	},
	
	/* assistive */
	{
		name: 'Highlighted Text',
		element: 'span',
		attributes: {
			'class': 'inlineTextHighlight'
		}
	},
	{
		name: 'Small Text',
		element: 'span',
		attributes: {
			'class': 'small'
		}
	},
	
	/* default text styles */
	{
		name: 'Discreet Text',
		element: 'span',
		attributes: {
			'class': 'discreetText'
		}
	},
	{
		name: 'Upsized Text',
		element: 'span',
		attributes: {
			'class': 'upSizedText'
		}
	},
	{
		name: 'Assistance Link',
		element: 'a',
		attributes: {
			'class': 'inlineAssistanceXref'
		}
	},
	
	/* image styles */
	{
		name: 'Image (Full Width)',
		element: 'img',
		attributes: {
			'class': 'fullWidthImage'
		}
	},
	{
		name: 'Image (Left Aligned)',
		element: 'img',
		attributes: {
			'class': 'leftAligned'
		}
	},
	{
		name: 'Image (Right Aligned)',
		element: 'img',
		attributes: {
			'class': 'rightAligned'
		}
	}
]);

