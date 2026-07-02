# Local-development shim: Liquid 4.0.3 (pinned by github-pages) calls
# Object#tainted?/#taint, which were removed in Ruby 3.2+. GitHub Pages
# builds in safe mode and never loads _plugins, so this only affects
# local `jekyll build/serve` on a modern Ruby.
unless Object.method_defined?(:tainted?)
  class Object
    def tainted?
      false
    end

    def taint
      self
    end

    def untaint
      self
    end
  end
end
