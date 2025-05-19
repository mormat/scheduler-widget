<?php
/**
 * @package test_nonce_provider
 * @version 0.0.1
 */
/*
Plugin Name: Test Nonce Provider
Description: Provide nonce for testing purpose
Version: 0.0.1
*/

// Do not load directly.
if ( ! defined( 'ABSPATH' ) ) {
    die();
}

function test_nonce_provider_admin_notices() {
    $nonce = wp_create_nonce('wp_rest');
    echo '<div class="notice notice-info">';
    echo "wp_rest nonce ";
    echo '<span class="test_nonce_provider_wp_rest">' . $nonce . '</span>';
    echo '</div>';
}

add_action( 'admin_notices', 'test_nonce_provider_admin_notices' );