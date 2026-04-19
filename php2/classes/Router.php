<?php
/**
 * Router - Simple routing system
 * Demonstrates: Clean URL handling, Closure callbacks
 */

class Router
{
    private array $routes = [];
    private string $basePath = '';
    
    public function get(string $path, callable $handler): self
    {
        $this->routes['GET'][$path] = $handler;
        return $this;
    }
    
    public function post(string $path, callable $handler): self
    {
        $this->routes['POST'][$path] = $handler;
        return $this;
    }
    
    public function put(string $path, callable $handler): self
    {
        $this->routes['PUT'][$path] = $handler;
        return $this;
    }
    
    public function delete(string $path, callable $handler): self
    {
        $this->routes['DELETE'][$path] = $handler;
        return $this;
    }
    
    public function dispatch(): void
    {
        $method = $_SERVER['REQUEST_METHOD'];
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $uri = rtrim($uri, '/');
        
        if (empty($uri)) {
            $uri = '/';
        }
        
        if (isset($this->routes[$method])) {
            foreach ($this->routes[$method] as $path => $handler) {
                $params = $this->matchRoute($path, $uri);
                
                if ($params !== false) {
                    call_user_func_array($handler, $params);
                    return;
                }
            }
        }
        
        http_response_code(404);
        echo json_encode(['error' => 'Route not found']);
    }
    
    private function matchRoute(string $pattern, string $uri): array|false
    {
        $pattern = preg_replace('/\{([a-z]+)\}/', '(?P<$1>[^/]+)', $pattern);
        $pattern = '#^' . $pattern . '$#';
        
        if (preg_match($pattern, $uri, $matches)) {
            $params = [];
            
            foreach ($matches as $key => $value) {
                if (!is_numeric($key)) {
                    $params[$key] = $value;
                }
            }
            
            return empty($params) ? [] : $params;
        }
        
        return false;
    }
    
    public function setBasePath(string $path): self
    {
        $this->basePath = $path;
        return $this;
    }
    
    public function redirect(string $path): void
    {
        header('Location: ' . $this->basePath . $path);
        exit;
    }
}