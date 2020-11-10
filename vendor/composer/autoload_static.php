<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInitbd64f8b54ecba68ab65ebf2d9c900351
{
    public static $prefixLengthsPsr4 = array (
        'C' => 
        array (
            'Cactus\\BulkTagging\\' => 19,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'Cactus\\BulkTagging\\' => 
        array (
            0 => __DIR__ . '/../..' . '/src',
        ),
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInitbd64f8b54ecba68ab65ebf2d9c900351::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInitbd64f8b54ecba68ab65ebf2d9c900351::$prefixDirsPsr4;

        }, null, ClassLoader::class);
    }
}