<?php
/**
 * Autoloader - PSR-4 style class autoloading
 */

class Autoloader
{
    private static array $registered = [];
    
    public static function register(): void
    {
        spl_autoload_register(function ($class) {
            $prefix = __NAMESPACE__ . '\\';
            $baseDir = __DIR__ . '/';
            
            $len = strlen($prefix);
            if (strncmp($prefix, $class, $len) !== 0) {
                return;
            }
            
            $relativeClass = substr($class, $len);
            $file = $baseDir . str_replace('\\', '/', $relativeClass) . '.php';
            
            if (file_exists($file)) {
                require $file;
            }
        });
    }
}

Autoloader::register();