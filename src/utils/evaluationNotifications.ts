
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Sends notification emails about business idea evaluation
 */
export const sendEvaluationNotification = async (
  idea: string, 
  name: string, 
  email: string, 
  score: number | null, 
  result: string | null
) => {
  try {
    console.log('Sending evaluation notification...');
    
    toast.info('Sending email notifications...');
    
    const { data, error: notifyError } = await supabase.functions.invoke('notify-business-evaluation', {
      body: { 
        idea, 
        name, 
        email, 
        score, 
        result, 
        sendUserConfirmation: true,
        timestamp: new Date().toISOString() // Add timestamp for tracking
      }
    });
    
    if (notifyError) {
      console.error('Notification error:', notifyError);
      toast.error('Failed to send email notifications');
      return { 
        success: false, 
        status: 'Email server error - notification could not be sent' 
      };
    }
    
    console.log('Notification response:', data);
    
    if (data?.emailsConfigured === false) {
      console.warn('Email service not properly configured');
      toast.warning('Email service is not configured');
      return { 
        success: false, 
        status: 'Email service not configured - please contact support' 
      };
    }
    
    if (data?.warning) {
      console.warn('Notification warning:', data.warning);
      toast.warning(`${data.warning}`);
      return { 
        success: false, 
        status: data.warning 
      };
    }
    
    if (data?.adminEmailSent) {
      console.log('Admin notification email sent successfully');
    }
    
    if (data?.userEmailSent) {
      console.log('User confirmation email sent successfully');
      toast.success('Confirmation email sent to your inbox');
      return { 
        success: true, 
        status: 'Email sent successfully' 
      };
    } else if (data?.emailsConfigured !== false) {
      console.warn('User email not sent but email service is configured');
      toast.warning('Could not send confirmation email to your address');
      return { 
        success: false, 
        status: 'Could not send confirmation email to your address. Please check your email later.' 
      };
    }
    
    // If any email was sent, consider it partial success
    return { 
      success: data?.adminEmailSent || data?.userEmailSent, 
      status: data?.adminEmailSent ? 'Admin notification sent' : null 
    };
  } catch (err) {
    console.error('Error sending notification:', err);
    toast.error('Could not send email notifications');
    return { 
      success: false, 
      status: 'Network or server error - notification could not be sent' 
    };
  }
};
